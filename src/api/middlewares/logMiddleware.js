const { logger } = require('@config/')
const fs = require('fs')

const logSource = { source: 'Log Middleware' }

function backupLogger(message) {
  const timestamp = new Date().toISOString()
  const formattedMessage = `[${timestamp}] BACKUP: ${message}\n`
  fs.appendFile('backup.log', formattedMessage, (err) => {
    if (err) console.error('Failed to write to backup.log')
  })
}

function logMiddleware(req, res, next) {
  const start = Date.now()

  let method // Defined outside the try block
  let url // Defined outside the try block

  function logRequest() {
    try {
      method = req.method // Assign the value from req
      url = req.url // Assign the value from req

      const { headers, body, query, ip } = req
      const duration = Date.now() - start

      const logDetails = {
        ...logSource,
        method,
        path: url,
        ip,
        duration: `${duration}ms`
      }

      if (res.statusCode >= 500) {
        logDetails.errorStatus = res.statusCode
        if (body && body.error) {
          logDetails.errorMessage = body.error
        }
        if (req.user) {
          logDetails.user = req.user
        }
        logger.error(`[${method}] ${url} - ${res.statusCode}`, logDetails)
      } else if (res.statusCode >= 400) {
        logDetails.statusCode = res.statusCode
        logDetails.headers = headers
        logger.warn(`[${method}] ${url} - ${res.statusCode}`, logDetails)
      } else {
        logger.info(`[${method}] ${url} - ${res.statusCode}`, logDetails)
      }
    } catch (error) {
      // If there's an error with the primary logger, use the backup
      backupLogger(
        `Logging error: ${error.message}. Original request: ${method} ${url}`
      )
    }
  }

  res.on('finish', logRequest)
  next()
}

module.exports = logMiddleware
