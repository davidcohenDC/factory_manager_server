const rateLimiter = require('@middlewares/rateLimiter');
const logMiddleware = require('@middlewares/logMiddleware');
const auth = require('@middlewares/authenticate');
const pagination = require('@middlewares/pagination');
const { tagTest } = require('@middlewares/testTagMiddleware');

module.exports = {
  rateLimiter,
  logMiddleware,
  pagination,
  auth,
  tagTest
}
