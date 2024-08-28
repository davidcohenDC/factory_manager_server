const express = require('express')
const initializeLoaders = require('@bootstrap/')
const path = require('path')
const favicon = require('serve-favicon')
const app = express()
const { logWithSource } = require('@config/')
const logger = logWithSource('AppLoader')

// Serve the favicon
app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')))

const configureApp = async () => {
  await initializeLoaders(app)
  logger.info('App is configured')
  return app
}

// Expose the configure function and the app instance.
module.exports = { configureApp, app }
