const chatController = require('../controllers/chatController')
const { logger } = require('/src/config/')

module.exports = (io) => {
  const logSource = { source: 'Chat Events' }
  io.on('connection', (socket) => {
    logger.info('User connected', logSource)

    socket.on('chatMessage', (message) => {
      logger.info('Chat message received', { ...logSource, message }, logSource)
      chatController.broadcastMessage(io, message)
    })

    socket.on('disconnect', () => {
      logger.info('User disconnected', logSource)
    })
  })
}
