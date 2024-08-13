const mongooseLoader = require('@bootstrap/mongoose')
const expressLoader = require('@bootstrap/express')

// export modules in default

module.exports = async (app) => {
  await mongooseLoader()
  expressLoader(app)
}
