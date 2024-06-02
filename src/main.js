const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');
const token = process.env.TGBOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
const { isBlocked } = require('./blocklist');
require('./logger');

const commandsPath = path.join(__dirname, 'commands');
const commandHandlers = {};

fs.readdirSync(commandsPath).forEach(file => {
  const command = `/${path.parse(file).name}`;
  const handler = require(path.join(commandsPath, file));
  commandHandlers[command] = handler;
});

bot.on('message', (msg) => {
  const userName = msg.from.first_name;
  const userId = msg.from.id;
  const messageText = msg.text;

  if (isBlocked(userId)) {
    console.log(`WARN: Blocked user ${userName}, ${userId} tried to access the bot with the command or message "${messageText}".\n`);
    return;
  }

  if (commandHandlers[messageText]) {
    commandHandlers[messageText](bot, msg);
  }

  console.log(`INFO: User ${userName}, ${userId} sended a command or message with the content:
  • ${messageText}\n`)
});

bot.on('polling_error', (error) => {
  console.error('WARN: Polling error:', error);
});

console.log(`INFO: Lynx started\n`);
