const socketIo = require('socket.io')
const { broadcastChatMessage } = require('./handlers')
const { logger } = require('./config')

const logSource = 'Socket Server'

const initializeSocket = (server) => {
  const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:4000',
      methods: ['GET', 'POST'],
      credentials: true
    }
  })

  io.on('connection', (socket) => {
    logger.info('User connected', { source: logSource, socketId: socket.id })
    socket.on('chatMessage', (data) => broadcastChatMessage(socket, data))

    socket.on('disconnect', () => {
      logger.info('User disconnected', {
        source: logSource,
        socketId: socket.id
      })
    })
  })
}

module.exports = {
  initializeSocket
}
