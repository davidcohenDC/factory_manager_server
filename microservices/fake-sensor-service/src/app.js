const express = require('express');
const generateSensorData = require('@services/sensorGenerator');
const { logger } = require('@config/');
const initializeLoaders = require('@loaders/');
const logSource = { source: 'Express Server' };
const path = require('path');
const app = express();

// Serve the HTML file
app.use(express.static(path.join(__dirname, 'public')));

const start = async (io) => {
    await initializeLoaders(app);
    setInterval(generateSensorData(io), 2000); // Generate data every 2 seconds
    logger.info('App is configured', logSource);
    return app;
};

module.exports = { start, app };
