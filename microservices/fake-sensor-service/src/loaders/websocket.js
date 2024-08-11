const socketIo = require('socket.io');
const { logger } = require('@config/');

/**
 * Initialize WebSocket server and handle connections.
 * @param {Object} server - The HTTP server instance.
 * @returns {Object} Socket.io instance.
 */
function initializeWebSocket(server) {
    const io = socketIo(server);

    logger.info('Initializing WebSocket server...');

    io.on('connection', (socket) => {
        logger.info('A client connected to the WebSocket server.');

        socket.on('disconnect', () => {
            logger.info('A client disconnected from the WebSocket server.');
        });
    });

    logger.info('WebSocket server initialized successfully.');
    return io;
}

module.exports = initializeWebSocket;
