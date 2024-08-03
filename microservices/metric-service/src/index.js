const socketIo = require('socket.io')
const { logger } = require('./config')

const logSource ='Socket Server'

function sendMetrics(io) {
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss
  }

  io.emit('metrics', metrics)
}
// process.env.SERVICE_NAME
const initializeSocket = (server) => {

  const io = socketIo(server, {
    cors: {
      origin: "http://localhost:4000",
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    setInterval(() => {
      sendMetrics(socket)
    }, 500)
    logger.info('User connected', { source: logSource, socketId: socket.id})

    socket.on('disconnect', () => {
      logger.info('User disconnected', { source: logSource, socketId: socket.id })
    })
  })
}

module.exports = {
  initializeSocket
}
