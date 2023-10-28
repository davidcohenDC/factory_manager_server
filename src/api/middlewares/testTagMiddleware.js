
// Middleware to tag users as test users
module.exports.tagTest = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.body.test = 'true' // Add a test property to the data
  }
  next()
}

// Middleware for cleanup tasks
module.exports.cleanupTestUsers = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    await req.Model.deleteMany({ test: true })
  }
  next()
}
