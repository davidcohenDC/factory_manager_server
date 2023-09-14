const express = require('express')
const cors = require('cors')
const { prefix, jwtSecretKey, nodeEnv } = require('@config/')
const { userRedis, redisHost, redisPort } = require('../config/')
const { logger } = require('@config/')
const errorCodes = require('@utils/')
const { logMiddleware } = require('@middlewares/')
const compression = require('compression')
const routes = require('@routes/')
const bodyParser = require('body-parser')
const helmet = require('helmet')
const getExpeditiousCache = require("express-expeditious");

module.exports = (app) => {
  process.on('uncaughtException', (error) => {
    logger.error(`[Code: 00001] - Uncaught Exception: ${error.message}`, { error });
    process.exit(1);
  });

  process.on('unhandledRejection', (reason, promise) => {
    logger.error(`[Code: 00002] - Unhandled Rejection at Promise`, { reason, promise });
  });

  if (!jwtSecretKey) {
    logger.error(`[Code: 00003] - ${errorCodes['00003']}`);
    process.exit(1);
  }

  app.use(logMiddleware);

  // if (nodeEnv === 'development') {
  //   app.use(morgan('dev'));
  // }

  // if (nodeEnv === 'development') {
  //   app.use(morgan('dev'))
  // }

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
  app.use(helmet.frameguard());
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
  // app.use(morgan('dev'))
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
    res.status(error.status || 500);
    let resultCode = '00015';
    let level = 'External Error';
    if (error.status === 500) {
      resultCode = '00013';
      level = 'Server Error';
    } else if (error.status === 404) {
      resultCode = '00014';
      level = 'Client Error';
    }
    logger.error(`[Code: ${resultCode}] - ${level}: ${error.message}`, {
      user: req?.user?._id ?? null,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error
    });
    return res.json({
      resultMessage: {
        en: errorCodes[resultCode]
      },
      resultCode
    });
  });
}
