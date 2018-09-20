const logger = require('../utils/logger')

function scanBuilder (msg, bot) {
  return new Promise((resolve, reject) => {
    try {
      if (msg.chat.type !== 'private') {
        if (msg.document && msg.document.file_size < 32 * 1024 * 1024) {
          const buffer = []
          const fileStream = bot.getFileStream(msg.document.file_id)
          fileStream.on('data', (data) => buffer.push(data))
          fileStream.on('end', () => {
            resolve({
              file: {
                name: msg.document.file_name || 'unknown',
                size: msg.document.file_size,
                data: buffer[0]
              }
            })
          })
        } else {
          return null
        }
      } else { // Private chat
        if (msg.document && msg.document.file_size < 32 * 1024 * 1024) {
          const buffer = []
          const fileStream = bot.getFileStream(msg.document.file_id)
          fileStream.on('data', (data) => buffer.push(data))
          fileStream.on('end', () => {
            resolve({
              file: {
                name: msg.document.file_name || 'unknown',
                size: msg.document.file_size,
                data: buffer[0]
              }
            })
          })
        } else {
          if (msg.text) {
            if (/(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/.test(msg.text)) {
              resolve({ url: msg.text })
            } else if (/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9](?:\.[a-zA-Z]{2,})+$/.test(msg.text)) {
              resolve({ domain: msg.text })
            } else if (/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(msg.text)) {
              resolve({ ip: msg.text })
            } else {
              resolve({ unknown: true })
            }
          } else { // document, photo, video, audio, game, sticker, voice, video_note ...
            resolve({ unknown: true })
          }
        }
      }
    } catch (err) {
      logger.error(`scan build failed.
        Error: ${err}`)
      reject(err)
    }
  })
}

module.exports = scanBuilder
