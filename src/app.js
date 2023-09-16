const express = require('express');
const initializeLoaders = require('@loaders/');
const { logger } = require('@config/');
const app = express();
const logSource = { source: 'Express Server' };

const configureApp = async () => {
  await initializeLoaders(app);
  logger.info('App is configured', logSource);
  return app;
};

// Expose the configure function and the app instance.
module.exports = { configureApp, app };
