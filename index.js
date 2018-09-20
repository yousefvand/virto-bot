const TelegramBot = require('node-telegram-bot-api')
const processScanQueue = require('./lib/process-scan-queue')
const scanBuilder = require('./lib/scan-builder')
const scanEnqueue = require('./lib/scan-enqueue')
const VirusTotalApi = require('virustotal-api')
const sendReport = require('./lib/send-report')
const logger = require('./utils/logger')
const config = require('./config')

const bot = new TelegramBot(process.env.TELEGRAM_APIKEY || config.token.telegram, { polling: true })
const virusTotal = new VirusTotalApi(process.env.VIRUSTOTAL_APIKEY || config.token.virusTotal)
const users = new Map()
const scans = []

setInterval(() => processScanQueue(bot, virusTotal, scans)
  .catch((err) => logger.error(`Cannot process scan queue.
    ${err}`)), config.scan.processQueueInterval)

bot.on('message', async (msg) => {
  let user = users.get(msg.from.id)
  if (!user) {
    user = msg.from
    users.set(user.id, user)
  }

  if (user.is_bot) {
    bot.sendMessage(msg.chat.id, 'Sorry, service is not available to bots.')
    logger.warn(`bot access denied.
      botId: ${user.id}
      message: ${msg.text}`)
    return
  }
  const scan = await scanBuilder(msg, bot)
  if (scan && scan.unknown) {
    bot.sendMessage(msg.chat.id, 'You can only send file, url, ip or domain for scan', { reply_to_message_id: msg.message_id, parse_mode: 'HTML' })
    return
  } else if (scan.file && (msg.chat.type === 'private') && scan.file.size > 32 * 1024 * 1024) {
    bot.sendMessage(msg.chat.id, 'File is larger than 32 MB', { reply_to_message_id: msg.message_id, parse_mode: 'HTML' })
    return
  } else if (scan === null) {
    return
  }
  try {
    if (scan.file) { // file
      const result = await virusTotal.fileScan(scan.file.data, scan.file.name)
      if (result.response_code === 1) {
        const fileReport = await virusTotal.fileReport(result.resource)
        if (fileReport.response_code === 1) {
          sendReport(bot, user, msg.chat.id, fileReport, 'file', (msg.chat.type === 'private'), msg.message_id, true)
        } else {
          scanEnqueue(bot, user, msg.chat.id, msg.message_id, scans, fileReport, 'file', (msg.chat.type === 'private'))
        }
      } else {
        scanEnqueue(bot, user, msg.chat.id, msg.message_id, scans, result, 'file', (msg.chat.type === 'private'))
      }
    } else if (scan.url) { // url
      const result = await virusTotal.urlScan(scan.url)
      if (result.response_code === 1) {
        const urlReport = await virusTotal.urlReport(result.scan_id)
        if (urlReport.response_code === 1) {
          sendReport(bot, user, msg.chat.id, urlReport, 'url', (msg.chat.type === 'private'), msg.message_id, true)
        } else {
          scanEnqueue(bot, user, msg.chat.id, msg.message_id, scans, urlReport, 'url', (msg.chat.type === 'private'))
        }
      } else {
        scanEnqueue(bot, user, msg.chat.id, msg.message_id, scans, result, 'file', (msg.chat.type === 'private'))
      }
    } else if (scan.domain) { // domain
      const result = await virusTotal.domainReport(scan.domain)
      if (result.response_code === 1) {
        sendReport(bot, user, msg.chat.id, result, 'domain', (msg.chat.type === 'private'), msg.message_id, true)
      } else {
        scanEnqueue(bot, user, msg.chat.id, msg.message_id, scans, result, 'domain', (msg.chat.type === 'private'))
      }
    } else if (scan.ip) {
      bot.sendMessage(msg.chat.id, 'IP scan not implemented!', { reply_to_message_id: msg.message_id, parse_mode: 'HTML' })
      // const result = await virusTotal.ipAddressReport(scan.ip)
      // if (result.response_code === 1) {
      //   sendReport(bot, user, result, 'ip', (msg.chat.type === 'private'), msg.message_id, true)
      // } else {
      //   scanEnqueue(bot, user, msg.message_id, scans, result, 'ip', (msg.chat.type === 'private'))
      // }
    } else {
      logger.warn(`Unknown scan type.
        scan: ${scan}
        user: ${user}`)
    }
  } catch (err) {
    logger.error(`Scan failed! Error: ${err}`)
  }
})
