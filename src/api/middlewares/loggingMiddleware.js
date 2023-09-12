// loggingMiddleware.js
import logEvent from '../../utils/logger.js'

const loggingMiddleware = (req, res, next) => {
  const startHrTime = process.hrtime()

  res.on('finish', () => {
    const elapsedHrTime = process.hrtime(startHrTime)
    const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6

    logEvent(
      'API0000',
      req?.user?._id ?? '',
      'info',
      `Method: ${req.method}, URL: ${req.url}, Status: ${res.statusCode}, Response Time: ${elapsedTimeInMs}ms`
    )
  })

  next()
}

module.exports = loggingMiddleware
