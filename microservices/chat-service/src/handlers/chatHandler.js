const chatUtils = require('../utils/chatUtils')
const { logger } = require('../config')

const logSource = { source: 'Chat Handler' }

const broadcastChatMessage = (socket, data) => {
  logger.debug("Chat message: '" + data.message + "' received", {
    source: logSource
  })
  const formattedMessage = chatUtils.formatMessage(data.username, data.message)
  socket.broadcast.emit('chatMessage', formattedMessage)
}

const privateMessage = (socket, userId, data) => {
  socket.to(userId).emit('privateMessage', data)
}

const joinRoom = (socket, roomName) => {
  socket.join(roomName)
  socket.broadcast
    .to(roomName)
    .emit('roomJoin', { user: socket.id, room: roomName })
}

const leaveRoom = (socket, roomName) => {
  socket.leave(roomName)
  socket.broadcast
    .to(roomName)
    .emit('roomLeave', { user: socket.id, room: roomName })
}

const broadcastToRoom = (socket, roomName, data) => {
  socket.broadcast.to(roomName).emit('roomMessage', data)
}

const notifyTyping = (socket, data) => {
  socket.broadcast.emit('typing', data)
}

module.exports = {
  broadcastChatMessage,
  privateMessage,
  joinRoom,
  leaveRoom,
  broadcastToRoom,
  notifyTyping
}
