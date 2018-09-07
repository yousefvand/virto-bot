const logger = require('./utils/logger')
const config = require('./config')

logger.warn('nothing done yet!')
console.log(`Logger level: ${config.logger.level}`)
