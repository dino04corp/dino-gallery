const { request } = require('./promisify');
require('dotenv').config();

const TELE_BOT_TOKEN = process.env.TELE_BOT_TOKEN;
const TELE_CHAT_ID = process.env.TELE_CHAT_ID;

const telegram = {
    sendMessageToTelegram: (text, options = {}) => {
        const {
            teleBotToken = TELE_BOT_TOKEN,
            teleChatId = TELE_CHAT_ID,
            disable_notification = false,
        } = options;
        return request({
            url: `https://api.telegram.org/bot${teleBotToken}/sendMessage`,
            method: 'POST',
            form: { chat_id: teleChatId, text, disable_notification },
        }).catch((err) => console.warn('[utils][telebot] err: ', err));
    },
};

module.exports = telegram;
