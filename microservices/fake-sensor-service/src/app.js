const express = require('express');
const { logger } = require('@config/');
const initializeLoaders = require('@bootstrap/');
const path = require('path');
const errorHandler = require('@middlewares/errorHandler');

const app = express();

// Serve static files (e.g., HTML, CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

/**
 * Start the application by initializing loaders and middleware.
 * @param {Object} io - Socket.io instance for real-time communication.
 * @returns {Object} Express app instance.
 */
const startApp = async (io) => {
    await initializeLoaders(app);
    logger.info('Application has been successfully configured.', { source: 'Express Server' });

    // Centralized error handling middleware
    app.use(errorHandler);
    return app;
};

module.exports = { startApp, app };
