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

    const sensorNamespace = io.of('/sensors');

    sensorNamespace.on('connection', (socket) => {
        logger.info('A client connected to the /sensors namespace.');

        socket.on('joinRoom', (roomId) => {
            socket.join(roomId);
            logger.info(`Client joined room: ${roomId}`);
        });

        socket.on('leaveRoom', (roomId) => {
            socket.leave(roomId);
            logger.info(`Client left room: ${roomId}`);
        });

        socket.on('disconnect', () => {
            logger.info('A client disconnected from the /sensors namespace.');
        });
    });

    logger.info('WebSocket server initialized successfully.');
    return io;
}

module.exports = initializeWebSocket;