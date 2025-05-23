const { google } = require('googleapis');

const {
  getUserByTelegramId,
  sendTelegramMessage,
  generateAuthUrl,
  getOAuthClient,
  fetchImageFromMessage,
  notifyDeniz,
  // selectCalendar
} = require('./utils');
const { openAIProcessText } = require('./openai-text');
const { openAIProcessImage } = require('./openai-image');
const env = process.env.ENVIRONMENT;

module.exports.handler = async (event) => {
  try {

    const body = JSON.parse(event.body);
    const message = body.message ? body.message : null

    if (!message) {
      throw new Error(JSON.stringify({
        message: "[internal] No message in body",
      }));
    }

    const chatId = message.chat.id;

    let user = await getUserByTelegramId(chatId);

    if (env === 'prod' && !user) {
      const authUrl = generateAuthUrl(chatId);
      await notifyDeniz("new user!")
      await sendTelegramMessage(
        chatId,
        `Hello! Please <a href="${authUrl.replace(/&/g, '&amp;')}"> connect your Google account</a> to get started.`
      );

      return { statusCode: 200, body: "Auth link sent" };
    }

    const oAuth2Client = getOAuthClient();
    oAuth2Client.setCredentials({
      access_token: user.access_token,
      refresh_token: user.refresh_token
    });

    try {
      var eventJSON = {
        parsed: false
      }

      if (message.photo) {
        const base64Image = await fetchImageFromMessage(message.photo)
        await notifyDeniz("got an image")
        eventJSON = await openAIProcessImage(base64Image)
      } else if (message.text) {
        await notifyDeniz(message.text)
        eventJSON = await openAIProcessText(message.text)
      }

      if (eventJSON.parsed) {
        const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });

        await Promise.all(eventJSON.events.map(event => {
          return calendar.events.insert({
            calendarId: 'primary',
            requestBody: {
              start: { dateTime: event.start.dateTime, timeZone: 'America/Los_Angeles' },
              end: { dateTime: event.end.dateTime, timeZone: 'America/Los_Angeles' },
              summary: event.summary
            }
          });
        }));

        await sendTelegramMessage(
          chatId,
          eventJSON.report || "Event created on your Google Calendar!"
        );

      } else {
        await sendTelegramMessage(
          chatId,
          "Sorry, I wasn't able to create an event based on your input."
        );
        if (message.text) (
          await notifyDeniz(`parse error: ${message.text}`)
        )
      }

      return { statusCode: 200, body: "OK" };

    } catch (error) {
      if (error?.response?.data?.error === 'invalid_grant') {
        const authUrl = generateAuthUrl(chatId);
        await sendTelegramMessage(
          chatId,
          `Oh no- it looks like we need to <a href="${authUrl.replace(/&/g, '&amp;')}"> reconnect your Google account</a> to continue.`
        );

        return { statusCode: 200, body: "Auth link sent" };
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
    await notifyDeniz(`emitted error: ${errorMessage}`);
    return { statusCode: 200, body: "Error" };
  }
};
