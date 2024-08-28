require('module-alias/register')
require('dotenv').config()

const http = require('http')
const mongoose = require('mongoose')
const { port, logger } = require('@config/')
const { startApp, app } = require('./app')
const initializeWebSocket = require('@bootstrap/websocket') // Import the WebSocket initializer
const generateSensorData = require('@services/sensorGenerator')

const logSource = { source: 'Express Server' }

const startServer = async () => {
  logger.info('Initializing server...', logSource)
  try {
    const server = http.createServer(app)

    const io = initializeWebSocket(server) // Initialize the WebSocket server

    await startApp(io)
    logger.info('Server initialized successfully.', logSource)

    // Generate sensor data every 5 seconds
    await generateSensorData(io)()

    // Start listening for incoming requests
    server.listen(port, () => {
      logger.info(`Server is running on port ${port}.`, logSource)
    })

    // Handle graceful shutdown
    process.on('SIGINT', () => {
      logger.info('Gracefully shutting down the server...', logSource)
      server.close(async () => {
        logger.info('Server closed.', logSource)
        try {
          await mongoose.disconnect()
          logger.info('Disconnected from MongoDB.', logSource)
          process.exit(0)
        } catch (err) {
          logger.error('Error during MongoDB disconnection.', logSource)
          process.exit(1)
        }
      })
    })

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection:', {
        reason,
        promise,
        ...logSource
      })
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', {
        error,
        ...logSource
      })
      process.exit(1)
    })
  } catch (error) {
    logger.error('Error during server initialization:', {
      error,
      ...logSource
    })
    process.exit(1)
  }
}

startServer()
  .then((r) => console.log('Server started successfully'))
  .catch((e) => console.error('Error starting server:', e))
