const socketIo = require('socket.io');
const { logger } = require('@config/');

function initializeWebSocket(server) {
    const io = socketIo(server);

    io.on('connection', (socket) => {
        logger.info('Client connected');

        socket.on('disconnect', () => {
            logger.info('Client disconnected');
        });
    });

    return io;
}

module.exports = initializeWebSocket;
