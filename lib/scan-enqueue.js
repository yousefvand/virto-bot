async function scanEnqueue (bot, user, chatId, reqMsgId, scans, report, type, isPrivate) {
  const msg = await bot.sendMessage(chatId, '🔍 Scan in progress...\n🕵🏻 @virtobot', { reply_to_message_id: reqMsgId, parse_mode: 'HTML' })
  scans.push({
    ttl: 255,
    type: type,
    report: report,
    user: user,
    chatId: chatId,
    msgId: msg.message_id,
    isPrivate: isPrivate
  })
}

module.exports = scanEnqueue
