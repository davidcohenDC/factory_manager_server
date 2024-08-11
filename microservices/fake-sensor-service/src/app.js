const express = require('express');
const { logger } = require('@config/');
const initializeLoaders = require('@loaders/');
const logSource = { source: 'Express Server' };
const path = require('path');
const errorHandler = require('@middlewares/errorHandler'); // Import the error handler
const app = express();

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

const start = async (io) => {
    await initializeLoaders(app);
    logger.info('App is configured', logSource);
    app.use(errorHandler);
    return app;
};

module.exports = { start, app };
