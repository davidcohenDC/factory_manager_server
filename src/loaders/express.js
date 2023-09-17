const express = require('express')
const cors = require('cors')
const compression = require('compression')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const path = require('path')

const {
  prefix,
  jwtSecretKey,
  // nodeEnv,
  userRedis,
  redisHost,
  redisPort,
  logger
} = require('@config/')
const errorCodes = require('@utils/')
const routes = require('@routes/')
const { logMiddleware } = require('@middlewares/')

const logSource = { source: 'Express Loader' }

module.exports = (app) => {
  process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.message}`, {
      ...logSource,
      error
    })
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`Unhandled Rejection at Promise`, {
      ...logSource,
      reason,
      promise
    })
  })

  if (!jwtSecretKey) {
    logger.error(`${errorCodes['00003']}`, logSource)
    process.exit(1)
  }

  app.enable('trust proxy')
  app.disable('x-powered-by')
  app.disable('etag')
  app.use(logMiddleware)

  // Redis-based caching
  if (userRedis === 'true') {
    const getExpeditiousCache = require('express-expeditious')
    const cache = getExpeditiousCache({
      namespace: 'expresscache',
      defaultTtl: '1 minute',
      engine: require('expeditious-engine-redis')({
        redis: {
          host: redisHost,
          port: redisPort
        }
      })
    })
    app.use(cache)
  }

  app.get('/socketdemo', (_req, res) =>
    res.sendFile(path.join(__dirname, '..', '..', 'public', 'socket-demo.html'))
  )

  app.use(require('express-status-monitor')())

  app.use(cors())
  app.use(compression())
  app.use(bodyParser.json({ limit: '20mb' }))
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
  app.use(helmet.frameguard())
  app.use(helmet.noSniff())
  app.use(express.static('public'))

  app.use(prefix, routes)

  // app.get('/', (_req, res) =>
  //   res.status(200).json({
  //     resultMessage: { en: errorCodes['00004'] },
  //     resultCode: '00004'
  //   })
  // )
  app.get('/health', (_req, res) => res.send('OK'))

  app.use((_req, _res, next) => {
    const error = new Error(errorCodes['00014'])
    error.status = 404
    next(error)
  })

  app.use((error, req, res, _next) => {
    const status = error.status || 500
    let resultCode = status === 500 ? '00013' : '00014'
    let level = status === 500 ? 'Server Error' : 'Client Error'

    logger.error(`[Code: ${resultCode}] - ${level}: ${error.message}`, {
      ...logSource,
      user: req?.user?._id ?? null,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error
    })

    return res.status(status).json({
      resultMessage: { en: errorCodes[resultCode] },
      resultCode
    })
  })
}
