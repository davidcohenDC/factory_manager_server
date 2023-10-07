const socketIo = require('socket.io')
const { broadcastChatMessage } = require('./handlers/')
const { logger } = require('@root/config')

const logSource = { source: 'Socket Server' }

function sendMetrics(io) {
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss
  }

  io.emit('metrics', metrics)
}
const initializeSocket = (server) => {
  const io = socketIo(server)

  io.on('connection', (socket) => {
    setInterval(() => {
      sendMetrics(socket)
    }, 500)
    logger.info(
      'User connected',
      { ...logSource, socketId: socket.id },
      logSource
    )
    socket.on('chatMessage', (data) => broadcastChatMessage(socket, data))

    socket.on('disconnect', () => {
      logger.info(
        'User disconnected',
        { ...logSource, socketId: socket.id },
        logSource
      )
    })
  })
}

module.exports = {
  initializeSocket
}
