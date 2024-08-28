const fs = require('fs')
const { v4: uuidv4 } = require('uuid')

const { logWithSource } = require('@config/')
const logger = logWithSource('LogMiddleware')

function backupLogger(message) {
  const timestamp = new Date().toISOString()
  const formattedMessage = `[${timestamp}] BACKUP: ${message}\n`
  fs.appendFile('backup.log', formattedMessage, (err) => {
    if (err) console.error('Failed to write to backup.log:', err.message)
  })
}
function logMiddleware(req, res, next) {
  const requestId = uuidv4()
  req.requestId = requestId
  res.setHeader('X-Request-Id', requestId)

  const start = Date.now()
  const { method, url, headers, ip } = req

  function logRequest() {
    const duration = Date.now() - start
    const logDetails = {
      method,
      path: url,
      ip,
      duration: `${duration}ms`,
      requestId,
      user: req.user ? req.user._id : null,
      statusCode: res.statusCode,
      requestHeaders: headers,
      responseHeaders: res.getHeaders()
    }

    if (res.statusCode >= 500) {
      logger.error(`Server error on [${method}] ${url}`, logDetails)
    } else if (res.statusCode >= 400) {
      logger.warn(`Client error on [${method}] ${url}`, logDetails)
    } else {
      logger.info(`Request completed [${method}] ${url}`, logDetails)
    }
  }

  res.on('finish', logRequest)
  next()
}

module.exports = logMiddleware
