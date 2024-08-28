const mongoose = require('mongoose')

/**
 * Connect to the MongoDB database.
 * @param {string} uri - MongoDB connection string.
 * @returns {Promise} Promise representing the connection.
 */
const connectToDatabase = async (uri) => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    logger.info('Successfully connected to MongoDB.')
  } catch (error) {
    logger.error('Failed to connect to MongoDB:', { error })
    throw error
  }
}

module.exports = {
  connectToDatabase
}
