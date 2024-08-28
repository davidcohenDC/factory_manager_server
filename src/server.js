require('module-alias/register')
const { app, configureApp } = require('@root/app')
const { port } = require('@config/')
const mongoose = require('mongoose')
const logSource = { source: 'Express Server' }
const http = require('http')
const { logWithSource } = require('@config/')
const logger = logWithSource('Server')

const startServer = async () => {
  await configureApp() // Configure the app before starting the server

  const server = http.createServer(app)

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

startServer().then((r) => r)
