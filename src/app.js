require('module-alias/register')
const express = require('express');
const { port } = require('./config');
const loader = require('@loaders/');
const { logger } = require('@config/'); // Modify the path to point to your logger file
const app = express();

loader(app).then(() => logger.info('Server is loaded'));

const server = app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});

process.on('SIGINT', () => {
  logger.info('Gracefully shutting down...');
  server.close(() => {
    logger.info('[Code: 00005] - Server is closed');
    process.exit(0);
  });
});

module.exports = server; // For chai-http
