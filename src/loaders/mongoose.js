const mongoose = require('mongoose')
const { dbUri } = require('@config/')
const { logger } = require('@config/') // Adjust the path to your logger file

const sourceName = 'MongoDB Connection'

module.exports = async () => {
  mongoose.set('strictQuery', false)

  try {
    await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })

    logger.info('Successfully connected to MongoDB', { source: sourceName })
  } catch (error) {
    logger.error('Error connecting to MongoDB', { error, source: sourceName })
  }

  mongoose.connection.on('error', (error) => {
    logger.error('MongoDB connection error', { error, source: sourceName })
  })

  mongoose.connection.on('disconnected', () => {
    logger.warn('MongoDB connection disconnected', { source: sourceName })
  })

  mongoose.connection.on('reconnected', () => {
    logger.info('MongoDB connection reconnected', { source: sourceName })
  })
}
