const mongoose = require('mongoose')
const { configureApp, app } = require('@root/app')

const initializeServer = async () => {
  await configureApp()
  return app.listen()
}

const closeServer = async (server) => {
  await mongoose.disconnect()
  server.close()
}

module.exports = {
  initializeServer,
  closeServer
}
