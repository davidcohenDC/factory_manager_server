require('module-alias/register')
const express = require('express')
const { port } = require('./config')
const initializeLoaders = require('@loaders/')
const { logger } = require('@config/')
const mongoose = require('mongoose')
const app = express()
const logSource = { source: 'Express Server' }

initializeLoaders(app).then(() => logger.info('Server is loaded', logSource))

const startServer = (appInstance) => {
  const server = appInstance.listen(port, () => {
    logger.info(`Server is running on port ${port}`, logSource)
  })

  process.on('SIGINT', () =>
  {
    logger.info('Gracefully shutting down...', logSource)
    server.close(() => {
      logger.info('Server is closed', logSource)
      // Disconnect mongoose connection
      mongoose.disconnect()
          .then(() => {
            logger.info('Mongoose disconnected', logSource);
            process.exit(0);
          })
          .catch(() => {
            logger.error('Error while disconnecting from Mongoose', logSource);
            process.exit(1);
          });
    })
  })

  return server
}

const server = startServer(app)

module.exports = server // For testing
