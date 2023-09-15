require('module-alias/register')
const express = require('express')
const { port } = require('./config')
const loader = require('@loaders/')
const { logger } = require('@config/') // Modify the path to point to your logger file
const app = express()

const logSource = { source: 'Express Server' }
loader(app).then(() => logger.info('Server is loaded', logSource))

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`, logSource)
})

process.on('SIGINT', () => {
  logger.info('Gracefully shutting down...', logSource)
  server.close(() => {
    logger.info('[Code: 00005] - Server is closed', logSource)
    process.exit(0)
  })
})

module.exports = server // For chai-http
