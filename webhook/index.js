const { google } = require('googleapis');

const {
  getUserByTelegramId,
  sendTelegramMessage,
  generateAuthUrl,
  getOAuthClient,
  fetchImageFromMessage,
  notifyDeniz,
  logMessage,
  deleteUserByTelegramId,
  updateTokensByTelegramId
  // selectCalendar
} = require('./utils');
const { openAIProcessText } = require('./openai-text');
const { openAIProcessImage } = require('./openai-image');
const env = process.env.ENVIRONMENT;
const logmsg = false;
const DEFAULT_TIME_ZONE = 'America/Los_Angeles';

const getTimeZoneOffsetMinutes = (date, timeZone) => {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  const parts = dtf.formatToParts(date);
  const values = {};
  parts.forEach((part) => {
    values[part.type] = part.value;
  });
  const asUTC = Date.UTC(
    Number(values.year),
    Number(values.month) - 1,
    Number(values.day),
    Number(values.hour),
    Number(values.minute),
    Number(values.second)
  );
  return (asUTC - date.getTime()) / 60000;
};

const normalizeDateTime = (dateTime, timeZone) => {
  if (!dateTime) return null;
  if (/[zZ]|[+-]\d{2}:\d{2}$/.test(dateTime)) return dateTime;
  const match = dateTime.match(/^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})(?::(\d{2}))?/);
  if (!match) return null;
  const [, year, month, day, hour, minute, second] = match;
  const assumedUTC = new Date(Date.UTC(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second || 0)
  ));
  const offsetMinutes = getTimeZoneOffsetMinutes(assumedUTC, timeZone);
  const actualUTC = new Date(assumedUTC.getTime() - offsetMinutes * 60000);
  return actualUTC.toISOString();
};

module.exports.handler = async (event) => {
  let chatId = null;
  try {

    const body = JSON.parse(event.body || '{}');
    const message = body.message ? body.message : null;
    const testMode = body?.test === true || body?.test === 'true';

    if (testMode) {
      if (!message?.text) {
        return { statusCode: 400, body: JSON.stringify({ error: "Test mode requires message.text" }) };
      }
      const eventJSON = await openAIProcessText(message.text);
      return { statusCode: 200, body: JSON.stringify(eventJSON) };
    }
    if (logmsg) { // Log incoming Telegram message in a readable, safe way for CloudWatch
      try {
        logMessage(message);
      } catch (logErr) {
        console.warn('Failed to log incoming Telegram message:', logErr && logErr.stack ? logErr.stack : logErr);
      }
    }

    if (!message) {
      throw new Error(JSON.stringify({
        message: "[internal] No message in body",
      }));
    }

    chatId = message.chat.id;

    let user = await getUserByTelegramId(chatId);

    if (env === 'prod' && !user) {
      const authUrl = generateAuthUrl(chatId);
      await notifyDeniz(chatId, "new user!")
      await sendTelegramMessage(
        chatId,
        `Hello! Please <a href="${authUrl.replace(/&/g, '&amp;')}"> connect your Google account</a> to get started. You'll need to resubmit your last message after connecting. We never keep information about your messages or events!`
      );

      return { statusCode: 200, body: "Auth link sent" };
    }

    const oAuth2Client = getOAuthClient();
    oAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token,
      expiry_date: user.expiry_date
    });
    let tokenUpdatePromise = null;
    const finalize = async (payload) => {
      if (tokenUpdatePromise) {
        await tokenUpdatePromise;
      }
      return payload;
    };

    // Persist refreshed tokens so we don't keep using stale credentials
    oAuth2Client.on('tokens', (tokens) => {
      if (!tokens) return;
      const payload = {
        access_token: tokens.access_token || user.access_token,
        expiry_date: tokens.expiry_date || user.expiry_date
      };
      if (tokens.refresh_token) {
        payload.refresh_token = tokens.refresh_token;
        user.refresh_token = tokens.refresh_token;
      }
      if (tokens.access_token) user.access_token = tokens.access_token;
      if (tokens.expiry_date) user.expiry_date = tokens.expiry_date;
      tokenUpdatePromise = updateTokensByTelegramId(chatId, payload).catch((err) => {
        console.error('Failed to persist refreshed tokens:', err && err.stack ? err.stack : err);
      });
    });

    try {
      var eventJSON = {
        parsed: false
      }
      if (message.entities && message.entities.some(e => e.type === 'bot_command')) {
        if (message.text === '/delete') {
              await deleteUserByTelegramId(chatId);
              await notifyDeniz(chatId, "deleted user")
              await sendTelegramMessage(
                chatId,
                "Your user information has been successfully deleted, if you start chatting with calendarbot again, you will need to reauthenticate with Google. We never keep information about your messages or events!"
              )
              return finalize({ statusCode: 200, body: "User deleted" });

            }
          }
      else if (message.photo) {
        const base64Image = await fetchImageFromMessage(message.photo)
        await notifyDeniz(chatId, "got an image")
        eventJSON = await openAIProcessImage(base64Image)
      } else if (message.text) {
        await notifyDeniz(chatId, message.text)
        eventJSON = await openAIProcessText(message.text)
      }

      if (eventJSON.parsed) {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        const conflictChecks = await Promise.all(eventJSON.events.map(async (event) => {
          try {
            const timeMin = normalizeDateTime(event.start?.dateTime, DEFAULT_TIME_ZONE);
            const timeMax = normalizeDateTime(event.end?.dateTime, DEFAULT_TIME_ZONE);
            if (!timeMin || !timeMax) {
              throw new Error('Invalid or missing event times for conflict check');
            }
            const response = await calendar.events.list({
              calendarId: 'primary',
              timeMin,
              timeMax,
              singleEvents: true,
              orderBy: 'startTime'
            });
            return { event, conflicts: response.data.items || [], error: null };
          } catch (conflictError) {
            console.error('Failed to check conflicts:', conflictError?.response?.data || conflictError?.stack || conflictError);
            return { event, conflicts: [], error: conflictError };
          }
        }));

        await Promise.all(eventJSON.events.map(event => {
          return calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
              start: { dateTime: event.start.dateTime, timeZone: DEFAULT_TIME_ZONE },
              end: { dateTime: event.end.dateTime, timeZone: DEFAULT_TIME_ZONE },
              ...(event.location ? { location: event.location } : {}),
              ...(event.description ? { description: event.description } : {}),
              summary: event.summary
            }
          });
        }));

        await sendTelegramMessage(
          chatId,
          eventJSON.report || "Event created on your Google Calendar!"
        );

        const conflictMessages = [];
        conflictChecks.forEach(({ event, conflicts, error }) => {
          if (error) {
            conflictMessages.push(`I couldn't check for conflicts with "${event.summary || 'Untitled event'}".`);
            return;
          }
          if (!conflicts.length) return;
          conflictMessages.push(`This event conflicts with another event(s) on your calendar:"${event.summary || 'Untitled event'}":`);
          conflicts.forEach((conflict) => {
            conflictMessages.push(`- ${conflict.summary || 'Untitled event'}`);
          });
        });

        if (conflictMessages.length) {
          await sendTelegramMessage(chatId, conflictMessages.join('\n'));
        }

      } else {
        await sendTelegramMessage(
          chatId,
          "Sorry, I wasn't able to create an event based on your input."
        );
        if (message.text) (
          await notifyDeniz(chatId, `parse error: ${message.text}`)
        )
      }

      return finalize({ statusCode: 200, body: "OK" });

    } catch (error) {
      if (error?.response?.data?.error === 'invalid_grant') {
        const authUrl = generateAuthUrl(chatId);
        await sendTelegramMessage(
          chatId,
          `Oh no- it looks like we need to <a href="${authUrl.replace(/&/g, '&amp;')}"> reconnect your Google account</a> to continue.`
        );

        return finalize({ statusCode: 200, body: "Auth link sent" });
      }
      else {
        await sendTelegramMessage(
          chatId,
          `Oh no- it looks like there's an error in my code. I'll notify Deniz and have her take a look right away.`
        );
        throw error
      }
    }

    // await selectCalendar(oAuth2Client, chatId); 

  } catch (error) {
    const errorMessage = error.message || JSON.stringify(error);
    console.error('Error details:', {
      message: errorMessage,
      stack: error.stack,
      error: error
    });
    await notifyDeniz(chatId, `emitted error: ${errorMessage}`);
    return { statusCode: 200, body: "Error" };
  }
};
