const logger = require('../utils/logger')
const sendReport = require('./send-report')

function processScanQueue (bot, virusTotal, scans) {
  return new Promise((resolve, reject) => {
    logger.info(`processing ${scans.length} scan jobs.`)
    scans.forEach((scan, index) => {
      scan.ttl--
      if (scan.ttl < 0) {
        logger.warn(`Cannot resolve scan (TTL=0).
          scan: ${scan}
          user: ${scan.user}`)
        scans.splice(index, 1)
        resolve()
      }
      if (scan.type === 'file') {
        virusTotal.fileReport(scan.report.resource)
          .then((fileReport) => {
            if (fileReport.response_code === 1) {
              sendReport(bot, scan.user, scan.chatId, fileReport, 'file', scan.isPrivate, scan.msgId, false)
                .then(() => {
                  scans.splice(index, 1)
                  resolve()
                })
                .catch((err) => reject(err))
            }
          })
          .catch((err) => reject(err))
      } else if (scan.type === 'url') {
        virusTotal.urlReport(scan.report.scan_id)
          .then((urlReport) => {
            if (urlReport.response_code === 1) {
              sendReport(bot, scan.user, scan.chatId, urlReport, 'url', scan.isPrivate, scan.msgId, false)
                .then(() => {
                  scans.splice(index, 1)
                  resolve()
                })
                .catch((err) => reject(err))
            }
          })
          .catch((err) => reject(err))
      } else if (scan.type === 'domain') {
        virusTotal.domainReport(scan.report.resource)
          .then((domainReport) => {
            if (domainReport.response_code === 1) {
              sendReport(bot, scan.user, scan.chatId, domainReport, 'domain', scan.isPrivate, scan.msgId, false)
                .then(() => {
                  scans.splice(index, 1)
                  resolve()
                })
                .catch((err) => reject(err))
            }
          })
          .catch((err) => reject(err))
      } else {
        logger.warn(`Unknown scan type.
          scan: ${scan}`)
        resolve()
      }
    })
  })
}

// } else if (scan.type === 'ip') {
//   const ipReport = await virusTotal.ipAddressReport(scan.report.resource)
//   if (ipReport.response_code === 1) {
//     await sendReport(bot, scan.user, scan.chatId, ipReport, 'ip', scan.isPrivate, scan.msgId, false)
//     scans.splice(index, 1)
//   }
// }

module.exports = processScanQueue
