const { config } = require('dotenv');
const dotenvExpand = require('dotenv-expand')
const logger = require('@config/logger')
dotenvExpand.expand(config())
config()

module.exports = {
    logger,
    port: process.env.PORT || 5000,
    dbUri: process.env.TEST_DB_URI,
    jwtSecret: process.env.JWT_SECRET,
}