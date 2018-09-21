// TODO: Object merge doesn't override base object appropriately

const config = {
  env: 'development',
  logger: {
    level: 'info'
  },
  token: {
    virusTotal: '<YOUR VIRUSTOTAL API TOKEN>',
    telegram: '<YOUR TELEGRAM BOT TOKEN>'
  }
}

module.exports = config
