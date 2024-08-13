const { config } = require('dotenv');
const dotenvExpand = require('dotenv-expand')
dotenvExpand.expand(config())
config()

module.exports = {
    logger: require('@config/logger'),
    port: process.env.PORT || 5000,
    dbUri: process.env.TEST_DB_URI,
    jwtSecret: process.env.JWT_SECRET,
}