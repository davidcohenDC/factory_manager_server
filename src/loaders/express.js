const express = require('express');
const cors = require('cors');
const compression = require('compression');
const bodyParser = require('body-parser');
const helmet = require('helmet');

const {
  prefix,
  jwtSecretKey,
  nodeEnv,
  userRedis,
  redisHost,
  redisPort,
  logger
} = require('@config/');
const errorCodes = require('@utils/');
const routes = require('@routes/');
const { logMiddleware } = require('@middlewares/');

module.exports = (app) => {
  // Centralize exception and rejection handling
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

  // Basic configurations and middleware
  app.enable('trust proxy');
  app.disable('x-powered-by');
  app.disable('etag');
  app.use(logMiddleware);

  // Environment-specific middleware
  // if (nodeEnv === 'development') {
  //   app.use(morgan('dev'));
  // }

  // Redis-based caching
  if (userRedis === 'true') {
    const getExpeditiousCache = require('express-expeditious');
    const cache = getExpeditiousCache({
      namespace: 'expresscache',
      defaultTtl: '1 minute',
      engine: require('expeditious-engine-redis')({
        redis: {
          host: redisHost,
          port: redisPort
        }
      })
    });
    app.use(cache);
  }

  // Parsers, security, and other utilities
  app.use(cors());
  app.use(compression());
  app.use(bodyParser.json({ limit: '20mb' }));
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }));
  app.use(helmet.frameguard());
  app.use(helmet.noSniff());
  app.use(helmet.referrerPolicy({ policy: 'same-origin' }));
  app.use(express.static('public'));

  // API routes
  app.use(prefix, routes);

  // Health check and root endpoint
  app.get('/', (_req, res) => res.status(200).json({
    resultMessage: { en: errorCodes['00004'] },
    resultCode: '00004'
  }));
  app.get('/health', (_req, res) => res.send('OK'));

  // Error handling
  app.use((_req, _res, next) => {
    const error = new Error(errorCodes['00014']);
    error.status = 404;
    next(error);
  });

  app.use((error, req, res, _next) => {
    const status = error.status || 500;
    let resultCode = status === 500 ? '00013' : '00014';
    let level = status === 500 ? 'Server Error' : 'Client Error';

    logger.error(`[Code: ${resultCode}] - ${level}: ${error.message}`, {
      user: req?.user?._id ?? null,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
      error
    });

    return res.status(status).json({
      resultMessage: { en: errorCodes[resultCode] },
      resultCode
    });
  });
}
