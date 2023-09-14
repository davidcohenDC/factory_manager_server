const { rateLimiter } = require('@middlewares/rateLimiter')
const logMiddleware = require('@middlewares/logMiddleware')
const auth = require('@middlewares/authenticate')

module.exports = {
  rateLimiter,
  logMiddleware,
  auth
}
