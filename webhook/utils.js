const AWS = require('aws-sdk');
const { google } = require('googleapis');
const axios = require('axios');

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const DENIZ_BOT_TOKEN = process.env.DENIZ_BOT_TOKEN;
const DENIZ_BOT_CHATID = process.env.DENIZ_BOT_CHATID;
const TABLE_NAME = process.env.DYNAMODB_TABLE;

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const sendTelegramMessage = async (chatId, text) => {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  await axios.post(url, {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  });
}

const notifyDeniz = async (chatId,text) => {
  const url = `https://api.telegram.org/bot${DENIZ_BOT_TOKEN}/sendMessage`;
  // Include the originating chatId in the message for context when provided
  const bodyText = chatId ? `${chatId} — ${text}` : text;
  await axios.post(url, {
    chat_id: DENIZ_BOT_CHATID,
    text: bodyText,
    parse_mode: 'HTML'
  });
}

const getUserByTelegramId = async (telegramId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: String(telegramId) },
  };
  const result = await dynamoDB.get(params).promise();
  return result.Item;
}

const deleteUserByTelegramId = async (telegramId) => {
  const params = {
    TableName: TABLE_NAME,
    Key: { id: String(telegramId) },
    ReturnValues: 'ALL_OLD'
  };
  // Perform delete and return the old item if it existed
  const result = await dynamoDB.delete(params).promise();
  return result.Attributes || null;
}

const generateAuthUrl = (telegramId) => {
  const oAuth2Client = getOAuthClient();
  const state = String(telegramId); // or better: a random token stored in DB, then link them after verifying
  const url = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: ['https://www.googleapis.com/auth/calendar.calendarlist.readonly', 'https://www.googleapis.com/auth/calendar.events'],
    prompt: 'consent', // ensure we get a refresh_token
    state: state,
    include_granted_scopes: true,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI
  });
  return url;
}

const fetchImageFromMessage = async (photo) => {

  const photoFileId = photo.slice(-1)[0].file_id;

  const getFileUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getFile?file_id=${photoFileId}`;
  const filePathResponse = await axios.get(getFileUrl);
  const fileData = filePathResponse.data;

  if (fileData.ok) {
    const filePath = fileData.result.file_path;
    const downloadUrl = `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${filePath}`;
    const imageResponse = await axios.get(downloadUrl, { responseType: 'arraybuffer' });

    const base64Image = Buffer.from(imageResponse.data, 'binary').toString('base64');

    return base64Image;
  }
}

const getOAuthClient = () => {
  return new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  );
}

const selectCalendar = async (oAuth2Client, chatId) => {
  const calendar = google.calendar({ version: 'v3', auth: oAuth2Client });
  const cals = []
  try {

    const response = await calendar.calendarList.list();
    response.data.items.forEach(cal => {
      cals.push(cal.summary)
    });

    const keyboards = [];
    for (let i = 0; i < cals.length; i += 2) {
      const row = cals[i + 1] ? [{ text: cals[i] }, { text: cals[i + 1] }] : [{ text: cals[i] }]
      keyboards.push(row);
    }

    const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
    await axios.post(url, {
      chat_id: chatId,
      text: "please select a calendar",
      parse_mode: 'HTML',
      reply_markup: {
        one_time_keyboard: true,
        keyboard: keyboards
      }
    });
  } catch (error) {
    console.error('Error fetching calendars:', error);
    throw error;
  }
}

const logMessage = (message) => {
  const summary = {
    message_id: message?.message_id,
    from: message?.from ? {
      id: message.from.id,
      username: message.from.username,
      first_name: message.from.first_name,
      last_name: message.from.last_name
    } : undefined,
    chat: message?.chat ? {
      id: message.chat.id,
      type: message.chat.type,
      title: message.chat.title,
      username: message.chat.username
    } : undefined,
    date: message?.date,
    text: message?.text,
    has_photo: !!message?.photo,
    photo_count: message?.photo ? message.photo.length : 0,
    entities: message?.entities
  };

  console.info('Incoming Telegram message summary:', JSON.stringify(summary, null, 2));

  // Also log the full message JSON but truncate to avoid huge logs
  const full = JSON.stringify(message, null, 2);
  const MAX_LOG_CHARS = 8000;
  if (full.length <= MAX_LOG_CHARS) {
    console.info('Incoming Telegram message full:', full);
  } else {
    console.info('Incoming Telegram message full (truncated):', full.slice(0, MAX_LOG_CHARS) + `... [truncated, length=${full.length}]`);
  }
}

module.exports = {
  fetchImageFromMessage,
  getUserByTelegramId,
  sendTelegramMessage,
  generateAuthUrl,
  getOAuthClient,
  notifyDeniz,
  selectCalendar,
  logMessage,
  deleteUserByTelegramId
};
