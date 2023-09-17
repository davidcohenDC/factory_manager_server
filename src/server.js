require('module-alias/register')
const { app, configureApp } = require('./app')
const { logger } = require('@config/')
const mongoose = require('mongoose')
const { port } = require('./config')
const logSource = { source: 'Express Server' }
const http = require('http');
const { initializeSocket } = require('./sockets/');
const startServer = async () => {
  await configureApp() // Configure the app before starting the server


  const server = http.createServer(app);
  initializeSocket(server); // Initialize the socket.io server

  server.listen(port, () => {
    logger.info(`Server is running on port ${port}`, logSource)
  })

  process.on('SIGINT', () => {
    logger.info('Gracefully shutting down...', logSource)
    server.close(async () => {
      logger.info('Server is closed', logSource)
      try {
        await mongoose.disconnect()
        logger.info('Mongoose disconnected', logSource)
        process.exit(0)
      } catch (err) {
        logger.error('Error while disconnecting from Mongoose', logSource)
        process.exit(1)
      }
    })
  })

  return server
}

startServer()
