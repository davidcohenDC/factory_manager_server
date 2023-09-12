const express = require('express')
const cors = require('cors')
const { prefix, jwtSecretKey, nodeEnv } = require('../config/index.js')
const { loggingMiddleware, rateLimiter } = require('../../src/api/middlewares/')
const { userRedis, redisHost, redisPort } = require('../config/index.js')
const { logEvent } = require('../utils/logger.js')
const errorCodes = require('../utils/errorCode')
const morgan = require('morgan')
const compression = require('compression')
const routes = require('../api/routes/index.js')
const bodyParser = require('body-parser')

module.exports = (app) => {
  process.on('uncaughtException', (error) => {
    // logEvent('00001', null, 'error', error.message);
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    // logEvent('00002', null, 'error', { reason, promise });
  })

  process.on('SIGINT', () => {
    console.log('Gracefully shutting down...')
    server.close(() => {
      // logEvent('00005', null, 'info', 'Server is closed')
      process.exit(0)
    })
  })

  // app.use(loggingMiddleware);

  if (!jwtSecretKey) {
    // logEvent('00003', null, 'error', errorCodes['00003']);
    process.exit(1)
  }

  if (nodeEnv === 'development') {
    app.use(morgan('dev'))
  }

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

  app.use(bodyParser.json({ limit: '20mb' }))
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))

  // Init all other stuff
  app.enable('trust proxy')
  app.use(cors())
  app.use(compression())
  // app.use(express.json());
  // app.use(express.urlencoded({ extended: false }));
  app.use(morgan('dev'))
  app.use(express.static('public'))
  app.disable('x-powered-by')
  app.disable('etag')

  // app.use(rateLimiter);
  app.use(prefix, routes)

  app.get('/', (_req, res) => {
    return res
      .status(200)
      .json({
        resultMessage: {
          en: errorCodes['00004']
        },
        resultCode: '00004'
      })
      .end()
  })

  app.get('/health', (req, res) => res.send('OK'))

  app.use((_req, _res, next) => {
    const error = new Error(errorCodes['00014'])
    error.status = 404
    next(error)
  })

  app.use((error, req, res, _next) => {
    res.status(error.status || 500)
    let resultCode = '00015'
    let level = 'External Error'
    if (error.status === 500) {
      resultCode = '00013'
      level = 'Server Error'
    } else if (error.status === 404) {
      resultCode = '00014'
      level = 'Client Error'
    }
    logEvent(resultCode, req?.user?._id ?? '', level, error.message)
    return res.json({
      resultMessage: {
        en: errorCodes[resultCode]
      },
      resultCode: resultCode
    })
  })
}
