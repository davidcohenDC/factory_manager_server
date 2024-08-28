// Importa Express

const express = require('express')
const { initializeSocket } = require('./src/')
const http = require('http')
const traceMiddleware = require('./src/middlewares/traceMiddleware')
const { logger } = require('./src/config')

const port = 5000

const startServer = async () => {
  // Crea un'istanza dell'applicazione Express
  const app = express()
  // Use the trace ID middleware
  app.use(traceMiddleware)

  const server = http.createServer(app)
  await initializeSocket(server) // Initialize the socket.io server
  server.listen(port, () => {
    logger.info(`Server is running on port ${port}`)
  })
  return server
}

startServer().then((r) => r)
