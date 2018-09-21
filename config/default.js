const config = {
  env: 'development',
  logger: {
    name: 'virto',
    level: 'warning'
  },
  scan: {
    processQueueInterval: 1000 * 60 * 5
  },
  db: {
    provider: 'mongodb',
    connection: process.env.DATABASE_URL
  }
}

module.exports = config
