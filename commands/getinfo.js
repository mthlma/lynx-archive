const Strings = require('../locales/english.json');

async function getUserInfo(ctx) {
  let userInfoTemplate = Strings.userInfo;

  const userName = ctx.from.first_name || Strings.unKnown;
  const userId = ctx.from.id || Strings.unKnown;
  const userHandle = ctx.from.username ? `@${ctx.from.username}` : Strings.varNone;
  const isBot = ctx.from.is_bot ? Strings.varYes : Strings.varNo;
  const userPremium = ctx.from.is_premium ? Strings.varYes : Strings.varNo;
  const userLang = ctx.from.language_code || Strings.unKnown;

  userInfoTemplate = userInfoTemplate
    .replace('{userName}', userName)
    .replace('{userId}', userId)
    .replace('{userHandle}', userHandle)
    .replace('{isBot}', isBot)
    .replace('{userPremium}', userPremium)
    .replace('{userLang}', userLang);

  return userInfoTemplate;
}

async function getChatInfo(ctx) {
  if (ctx.chat.type === 'group' || ctx.chat.type === 'supergroup') {
    let chatInfoTemplate = Strings.chatInfo;

    const chatId = ctx.chat.id || Strings.unKnown;
    const chatName = ctx.chat.title;
    const chatHandle = ctx.chat.username ? `@${ctx.chat.username}` : Strings.varNone;
    const chatType = ctx.chat.type || Strings.unKnown;
    
    // Aguarde a contagem de membros ser resolvida
    const chatMembersCount = await ctx.telegram.getChatMembersCount(chatId);
    const isForum = ctx.chat.is_forum ? Strings.varYes : Strings.varNo;
    
    chatInfoTemplate = chatInfoTemplate
      .replace('{chatId}', chatId)
      .replace('{chatName}', chatName)
      .replace('{chatHandle}', chatHandle)
      .replace('{chatMembersCount}', chatMembersCount)
      .replace('{chatType}', chatType)
      .replace('{isForum}', isForum);
    
    return chatInfoTemplate;
  } else {
    return Strings.groupOnly;
  }
}

module.exports = (bot) => {
  bot.command('chatinfo', async (ctx) => {
    const chatInfo = await getChatInfo(ctx);
    ctx.reply(
      chatInfo, {
        parse_mode: 'Markdown'
      }
    );
  });

  bot.command('userinfo', async (ctx) => {
    const userInfo = await getUserInfo(ctx);
    ctx.reply(
      userInfo, {
        parse_mode: 'Markdown'
      }
    );
  });
};