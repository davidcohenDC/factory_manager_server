const mongooseLoader = require('./mongoose')
const expressLoader = require('./express')

//export modules in default

module.exports = async (app) => {
  await mongooseLoader()
  expressLoader(app)
}
