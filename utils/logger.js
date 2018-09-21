const log4js = require('log4js')
const config = require('../config')

log4js.configure({
  appenders: {
    console: { type: 'console' },
    filelog: { type: 'file', filename: `./logs/${config.logger.name}.log`, maxLogSize: 65536, backups: 99, compress: true }
  },
  categories: {
    default: { appenders: [ 'filelog', 'console' ], level: 'info' }
  }
})

const logger = log4js.getLogger()
logger.level = config.logger.level

module.exports = logger
