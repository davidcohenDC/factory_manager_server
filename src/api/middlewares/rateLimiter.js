const mongoose = require('mongoose')
const { RateLimiterMongo } = require('rate-limiter-flexible')
const { dbUri, logger } = require('@config/')

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
      logger.error(`[Code: 00024] - Error in rate-limiter.js: ${err.message}`, {
        module: 'rate-limiter',
        method: req.method,
        path: req.originalUrl,
        ip: req.ip
      })

      return res.status(429).send('Too many requests') // Added a message to the response
    })
}
