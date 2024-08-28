const mongoose = require('mongoose')
const { Schema } = mongoose
const { logWithSource } = require('@config/')
const logger = logWithSource('MachineSensorSchema')

const sensorDataEntrySchema = new Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true
  },
  powerConsumption: {
    type: mongoose.Types.Decimal128
  },
  emissions: {
    type: mongoose.Types.Decimal128
  },
  operatingTemperature: {
    type: mongoose.Types.Decimal128
  },
  vibration: {
    type: mongoose.Types.Decimal128
  },
  pressure: {
    type: mongoose.Types.Decimal128
  },
  anomaly: {
    type: Boolean,
    default: false
  }
})

const machineSensorDataSchema = new Schema({
  serial: {
    type: String, // Use String if you're using custom IDs like "MCH1011"
    required: true
  },
  sensorData: [sensorDataEntrySchema],
  test: { type: Boolean }
})

// Indexing
machineSensorDataSchema.index({ serial: 1 })

// Pre-save hook
machineSensorDataSchema.pre('save', function (next) {
  logger.info('Pre-save hook called')
  next()
})

// Post-save hook for catching errors
machineSensorDataSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(
        `Duplicate key error (MongoServerError): E11000 duplicate key error on serial: ${JSON.stringify(err.keyValue)}`
      )
      return next(new Error('Machine sensor with this serial already exists.'))
    } else {
      logger.error(`Error saving machine sensor: ${err.message}`)
      return next(err)
    }
  }
  next()
})

// Post-validate hook
machineSensorDataSchema.post('validate', function (doc) {
  logger.info(
    `Machine sensor with id: ${doc._id}, Serial: ${doc.serial} passed validation.`
  )
})

// Post-update hook
machineSensorDataSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    logger.info(
      `Machine sensor with id: ${doc._id}, Serial: ${doc.serial} was updated.`
    )
  } else {
    logger.warn('No machine sensor was found to update.')
  }
})

// Post-delete hook
machineSensorDataSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    logger.info(
      `Machine sensor with id: ${doc._id}, Serial: ${doc.serial} was deleted.`
    )
  } else {
    logger.warn('No machine sensor was found to delete.')
  }
})

const MachineSensor = mongoose.model('MachineSensor', machineSensorDataSchema)
module.exports = MachineSensor
