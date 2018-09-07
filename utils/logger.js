const log4js = require('log4js')
const config = require('../config')

log4js.configure({
  appenders: {
    everything: { type: 'file', filename: `./logs/${config.logger.name}.log`, maxLogSize: 4096, backups: 3, compress: true }
  },
  categories: {
    default: { appenders: [ 'everything' ], level: 'error' }
  }
})

const logger = log4js.getLogger()
logger.level = config.logger.level

module.exports = logger
