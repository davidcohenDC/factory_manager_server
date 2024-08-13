module.exports = {
  rateLimiter: require('@middlewares/rateLimiter'),
  logMiddleware: require('@middlewares/logMiddleware'),
  pagination: require('@middlewares/pagination'),
  auth: require('@middlewares/authenticate'),
  tagTest: require('@middlewares/testTagMiddleware')
}
