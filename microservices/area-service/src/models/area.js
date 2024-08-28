const mongoose = require('mongoose')
const { Schema } = mongoose
const Machine = require('./machine')

const { logger } = require("@config//")

const areaSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  size: { type: Number, required: true },
  machines: [Machine.schema],
  subAreas: [this], // Self-embedding for sub-areas
  test: { type: Boolean }
})

areaSchema.add({ subAreas: [areaSchema] })

// Indexing
areaSchema.index({ name: 1 })

// Pre-save hook
areaSchema.pre('save', function (next) {
  logger.info('Pre-save hook called for Area')
  next()
})

// Post-save hook for catching errors
areaSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(`Duplicate key error (MongoServerError): ${err.message}`)
      return next(new Error('Area with this name already exists.'))
    } else {
      logger.error(`Error saving area: ${err.message}`)
      return next(err)
    }
  }
  next()
})

// Post-validate hook
areaSchema.post('validate', function (doc) {
  logger.info(`Area with id: ${doc._id}, Name: ${doc.name} passed validation.`)
})

// Post-update hook
areaSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    logger.info(`Area with id: ${doc._id}, Name: ${doc.name} was updated.`)
  } else {
    logger.warn('No area was found to update.')
  }
})

// Post-delete hook
areaSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    logger.info(`Area with id: ${doc._id}, Name: ${doc.name} was deleted.`)
  } else {
    logger.warn('No area was found to delete.')
  }
})

const Area = mongoose.model('Area', areaSchema)

module.exports = Area
