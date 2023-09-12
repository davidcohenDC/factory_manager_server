const mongoose = require('mongoose')
const { RateLimiterMongo } = require('rate-limiter-flexible')
const { dbUri } = require('../../config/index.js')
const { logEvent } = require('../../utils/index.js')

mongoose.set('strictQuery', false)
const mongoConn = mongoose.createConnection(dbUri, {})

const opts = {
  storeClient: mongoConn,
  tableName: 'rateLimits',
  points: 1115, // x requests
  message: 'Too many requests', // Message displayed when consuming
  standardHeaders: true, // Support X-Forwarded-For
  maxConcurrent: 100, // Number of concurrent requests
  duration: 60 // per y second by IP
}

module.exports = (req, res, next) => {
  const rateLimiterMongo = new RateLimiterMongo(opts)
  rateLimiterMongo
    .consume(req.ip)
    .then(() => {
      next()
    })
    .catch((err) => {
      logEvent('00024', null, 'error', 'rate-limiter.js', err.message)
      return res.status(429)
    })
}
