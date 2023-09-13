const { rateLimiter } = require('@middlewares/rateLimiter')
const { loggingMiddleware } = require('@middlewares/loggingMiddleware')

module.exports = {
  rateLimiter,
  loggingMiddleware
}
