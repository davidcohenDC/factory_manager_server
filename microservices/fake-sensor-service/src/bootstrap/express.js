// src/bootstrap/express.js

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { logger } = require('@config/')
const logSource = { source: 'Express Loader' }

/**
 * Configure and initialize Express middlewares and routes.
 * @param {Object} app - The Express app instance.
 */
module.exports = (app) => {
  logger.info('Initializing Express middlewares...', logSource)

  // Handle uncaught exceptions and unhandled promise rejections
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception:', { error, ...logSource })
    process.exit(1)
  })

  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at Promise:', {
      reason,
      promise,
      ...logSource
    })
  })

  // Configure middlewares
  app.use(cors())
  app.use(bodyParser.json({ limit: '20mb' }))
  app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
  app.use(express.static('public'))

  // Health check endpoint
  app.get('/health', (_req, res) => res.send({ status: 'OK' }))

  logger.info('Express middlewares initialized successfully.', logSource)
}
