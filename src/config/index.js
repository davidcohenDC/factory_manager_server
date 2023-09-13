const { config } = require('dotenv')
const dotenvExpand = require('dotenv-expand')
const swaggerConfig = require('./swagger.config.js')
const logger = require('@config/winston-config')
dotenvExpand.expand(config())
config()

const {
  NODE_ENV,
  PORT,
  TEST_DB_URI,
  JWT_SECRET,
  TEST_COMMAND,
  REDIS_HOST,
  REDIS_PORT,
} = process.env

module.exports = {
  swaggerConfig,
  logger,
  port: PORT || 4000,
  dbUri: TEST_DB_URI,
  nodeEnv: NODE_ENV,
  jwtSecretKey: JWT_SECRET,
  testCommand: TEST_COMMAND,
  redisHost: REDIS_HOST,
  redisPort: REDIS_PORT,
  prefix: '/api',
  specs: '/docs'
}
