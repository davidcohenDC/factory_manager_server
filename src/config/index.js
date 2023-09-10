const { config } = require('dotenv');
const dotenvExpand = require('dotenv-expand');
dotenvExpand.expand(config())
config();

const { NODE_ENV, PORT, TEST_DB_URI, JWT_SECRET, TEST_COMMAND } = process.env

module.exports = {
    port: PORT || 4000,
    dbUri: TEST_DB_URI,
    nodeEnv: NODE_ENV,
    jwtSecretKey: JWT_SECRET,
    testCommand: TEST_COMMAND,
    prefix: '/api',
    specs: "/docs"
}