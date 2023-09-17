const socketIo = require('socket.io')
const { broadcastChatMessage } = require('./handlers/chatHandler')
const { logger } = require('@root/config')

const logSource = { source: 'Socket Server' }
const initializeSocket = (server) => {
  const io = socketIo(server)

  io.on('connection', (socket) => {
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
