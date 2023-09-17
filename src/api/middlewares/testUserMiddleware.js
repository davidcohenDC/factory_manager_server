const User = require('@models/user')

// Middleware to tag users as test users
module.exports.tagTestUser = (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    req.body.testUser = true // Add a testUser property to the user data
  }
  next()
}

// Middleware for cleanup tasks
module.exports.cleanupTestUsers = async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    await User.deleteMany({ testUser: true })
  }
  next()
}
