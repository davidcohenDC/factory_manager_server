const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcrypt')
const { logger } = require('@config/')

const logSource = { source: 'UserSchema' }

const userSchema = new Schema({
  name: {
    first: String,
    last: String
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  dateOfBirth: Date,
  address: {
    street: String,
    city: String,
    state: String,
    zip: String,
    country: String
  },
  phoneNumbers: [
    {
      type: {
        type: String,
        enum: ['mobile']
      },
      number: String
    }
  ],
  role: {
    type: String,
    enum: ['moderator', 'worker'],
    required: true
  },
  department: { type: String },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  profilePicture: String,
  security: {
    twoFactorEnabled: Boolean,
    lastPasswordChange: Date
  },
  preferences: {
    theme: {
      type: String,
      enum: ['light', 'dark'],
      default: 'light'
    },
    language: {
      type: String,
      enum: ['en', 'es', 'fr','it'],
      default: 'en'
    }
  },
  accessibility: {
    colorFilter: {
      type: String,
      enum: ['normal', 'protanopia', 'deuteranopia', 'tritanopia'],
      default: 'normal'
    },
  },
  socialLinks: {
    linkedin: String,
    twitter: String
  },
  joinedDate: Date,
  notes: String,
  test: { type: Boolean }
})

// Indexing
userSchema.index({ email: 1 })

// Virtual for fullName
userSchema
  .virtual('fullName')
  .get(function () {
    return this.name.firstName + ' ' + this.name.lastName
  })
  .set(function (value) {
    const parts = value.split(' ')
    this.name.firstName = parts[0]
    this.name.lastName = parts[1]
  })

userSchema.pre('save', async function (next) {
  logger.info('Pre save hook called', logSource)
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10)
    } catch (error) {
      logger.error(
        `Error hashing password for user ${this.email}: ${error.message}`,
        logSource
      )
      next(error)
    }
  }
  next()
})

userSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(
        `Error saving machine (MongoServerError): ${err.message}`,
        logSource
      )
      next(new Error('user is already taken.'))
    } else {
      next(err)
    }
  } else {
    next()
  }
})

userSchema.post('save', function (doc) {
  logger.info(
    `Successfully saved user with id: ${doc._id}, Email: ${doc.email}.`,
    logSource
  )
})

userSchema.post('validate', function (doc) {
  logger.info(
    `User with id: ${doc._id}, Email: ${doc.email} passed validation.`,
    logSource
  )
})

userSchema.post('findOneAndUpdate', function (doc) {
  if (!doc) {
    logger.warn('No user was found to update.', logSource)
    return
  }
  logger.info(
    `User with id: ${doc._id}, Email: ${doc.email} was updated.`,
    logSource
  )
})

userSchema.post('findOneAndDelete', function (doc) {
  if (!doc) {
    logger.warn('No user was found to delete.', logSource)
  } else {
    logger.info(
      `User with id: ${doc._id}, Email: ${doc.email} was deleted.`,
      logSource
    )
  }
})

const User = model('User', userSchema)
module.exports = User
