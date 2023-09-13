const { rateLimiter } = require('@middlewares/rateLimiter')
const { loggingMiddleware } = require('@middlewares/loggingMiddleware')
const auth = require('@middlewares/authenticate')

module.exports = {
  rateLimiter,
  loggingMiddleware,
  auth
}
