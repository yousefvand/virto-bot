const config = {
  env: 'development',
  logger: {
    name: 'virto',
    level: 'warning'
  },
  db: {
    provider: 'mongodb',
    connection: process.env.DATABASE_URL
  }
}

module.exports = config
