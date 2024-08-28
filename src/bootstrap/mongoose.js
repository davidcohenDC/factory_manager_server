const mongoose = require('mongoose')
const { dbUri } = require('@config/')
const { logWithSource } = require('@config/')
const logger = logWithSource('MongooseConnection')

module.exports = async () => {
  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    logger.info('Successfully connected to MongoDB')
  } catch (error) {
    logger.error('Error connecting to MongoDB')
  }

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', { error })
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected')
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection reconnected')
  })
}
