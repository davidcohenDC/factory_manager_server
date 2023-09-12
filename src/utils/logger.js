const { Log } = require('../models')
const ipHelper = require('./helpers/ip-helper.js')
const logger = require('../config/winston-config')
const errorCodes = require('./errorCode')

const logToDatabase = async (code, userId, message, level, ip) => {
  const logData = {
    resultCode: code,
    level,
    message: errorCodes[code] || message,
    ip,
    userId: userId || 'none'
  }

  try {
    const log = new Log(logData)
    await log.save()
  } catch (err) {
    logger.error(`Logging to database failed: ${err}`)
  }
}

module.exports.logToDatabase = logToDatabase

module.exports.logEvent = (code, userId, level, req, metadata = {}) => {
  const ip = req ? ipHelper(req) : 'no-ip'
  const message = errorCodes[code] || 'Unknown error.'

  logToDatabase(code, userId, message, level, ip)
  logger.log({
    level,
    message: `Code: ${code}, UserId: ${
      userId || 'none'
    }, IP: ${ip}, Message: ${message}`,
    metadata
  })
}
// Funzioni specifiche per ogni livello
module.exports.logError = (message, meta) => logger.error(message, meta)
module.exports.logWarn = (message, meta) => logger.warn(message, meta)
module.exports.logInfo = (message, meta) => logger.info(message, meta)
module.exports.logDebug = (message, meta) => logger.debug(message, meta)
