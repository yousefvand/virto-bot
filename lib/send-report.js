async function sendReport (bot, user, chatId, fileReport, type, isPrivate, msgId, reply) {
  const avs = fileReport.scans
  let report = ''
  if (isPrivate) { // Verbose
    for (let av in fileReport.scans) {
      report += `${avs[av].detected ? '🔴' : '🔵'} <b>${av}</b> 👉 ${avs[av].result ? avs[av].result : 'N/A'}\n`
    }
    report += `\n<b>Total: ${fileReport.positives}/${fileReport.total} infected</b>`
    report += `\n🕵🏻 @virtobot`
    if (reply) {
      await bot.sendMessage(chatId, report, { reply_to_message_id: msgId, parse_mode: 'HTML' })
    } else { // edit
      await bot.editMessageText(report, { chat_id: chatId, message_id: msgId, parse_mode: 'HTML' })
    }
  } else { // channels, groups
    if (fileReport.positives === 0) {
      report = `✅ Clean`
    } else {
      report = `📛 Infected (${Math.round((fileReport.positives / fileReport.total) * 100)}% confidence)`
    }
    report += `\n🕵🏻 @virtobot`
    if (reply) {
      await bot.sendMessage(chatId, report, { reply_to_message_id: msgId, parse_mode: 'HTML' })
    } else { // edit
      await bot.editMessageText(report, { chat_id: chatId, message_id: msgId, parse_mode: 'HTML' })
    }
  }
}

module.exports = sendReport
