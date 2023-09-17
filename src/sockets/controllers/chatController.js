module.exports = {
    broadcastMessage: (io, message) => {
        io.emit('newChatMessage', message);
    },
    sendMessageToUser: (io, userId, message) => {
        io.to(userId).emit('privateMessage', message);
    }
};