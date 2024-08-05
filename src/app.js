const express = require('express')
const initializeLoaders = require('@loaders/')
const { logger } = require('@config/')
const path = require('path');
const favicon = require('serve-favicon');
const app = express()

const logSource = { source: 'Express Server' }

// Serve the favicon
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));


const configureApp = async () => {
  await initializeLoaders(app)
  logger.info('App is configured', logSource)
  return app
}

// Expose the configure function and the app instance.
module.exports = { configureApp, app }
