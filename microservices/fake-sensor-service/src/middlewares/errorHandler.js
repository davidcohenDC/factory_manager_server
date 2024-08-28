const { logger } = require('@config/')

function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500
  const message = err.message || 'Internal Server Error'

  logger.error(`Error: ${message}`, {
    status: statusCode,
    stack: err.stack,
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query
  })

  res.status(statusCode).json({
    error: {
      message,
      statusCode
    }
  })
}

module.exports = errorHandler
