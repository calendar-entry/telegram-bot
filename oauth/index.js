const AWS = require('aws-sdk');
const { google } = require('googleapis');

const dynamoDB = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = process.env.DYNAMODB_TABLE;

module.exports.handler = async (event) => {
  try {
    // For API Gateway HTTP API, query params are in event.queryStringParameters
    const code = event.queryStringParameters?.code;
    const state = event.queryStringParameters?.state; // we used telegramId as state

    if (!code || !state) {
      return redirectWithMessage("Invalid callback parameters");
    }

    // 1. Exchange code for tokens
    const oAuth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oAuth2Client.getToken(code);

    // tokens should contain at least: { access_token, refresh_token, scope, token_type, expiry_date }

    if (!tokens.refresh_token) {
      // If no refresh token, user might have previously granted permission
      // Possibly force "prompt=consent" in generateAuthUrl to ensure refresh_token is always returned
      return redirectWithMessage("No refresh token received. Please remove consent and try again.");
    }

    // 2. Link them in the DB
    // In real code, verify that `state` is a valid session for that Telegram user
    const telegramId = state; // or look up a random token if used

    // Try to fetch Telegram user info (username, first_name, last_name) so we can store it.
    // This is optional — if TELEGRAM_BOT_TOKEN is not set or the API call fails, we'll still store tokens.
    let tgUser = null;
    try {
      const https = require('https');
      const token = process.env.TELEGRAM_BOT_TOKEN;
      if (token) {
        const url = `https://api.telegram.org/bot${token}/getChat?chat_id=${encodeURIComponent(telegramId)}`;
        tgUser = await new Promise((resolve) => {
          https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
              try {
                const parsed = JSON.parse(data);
                if (parsed && parsed.ok) resolve(parsed.result);
                else resolve(null);
              } catch (e) { resolve(null); }
            });
          }).on('error', () => resolve(null));
        });
      }
    } catch (e) {
      // silently ignore fetch errors; we don't want to fail the OAuth flow due to logging
      console.warn('Failed to fetch Telegram user info:', e && e.message ? e.message : e);
      tgUser = null;
    }

    const item = {
      id: telegramId,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expiry_date: tokens.expiry_date,
    };

    if (tgUser) {
      if (tgUser.username) item.username = tgUser.username;
      if (tgUser.first_name) item.first_name = tgUser.first_name;
      if (tgUser.last_name) item.last_name = tgUser.last_name;
    }

    await dynamoDB.put({
      TableName: TABLE_NAME,
      Item: item
    }).promise();

    // 3. Redirect user back to a "success" page or just show a simple message
    return redirectWithMessage("Success! You can now use calendar entry bot !");

  } catch (err) {
    console.error("OAuth callback error:", err);
    return redirectWithMessage("An error occurred during authentication.");
  }
};

/**
 * Helper: Return an HTTP 302 redirect with some message
 * For a serverless callback, you might not have a full webpage. We can create a basic HTML response or redirect to a static site.
 */
function redirectWithMessage(message) {
  // Minimal approach: just return HTML text
  return {
    statusCode: 200,
    headers: { "Content-Type": "text/html" },
    body: `<html><body><h1>${message}</h1></body></html>`,
  };
}
