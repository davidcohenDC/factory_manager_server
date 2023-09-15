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
    lowercase: true,
    match:
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
  },
  password: { type: String, required: true },
  dataOfBirth: Date,
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
    enum: ['administrator', 'moderator', 'worker'] // Array of strings
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
      enum: ['en', 'es', 'fr'],
      default: 'en'
    }
  },
  socialLinks: {
    linkedin: String,
    twitter: String
  },
  joinedDate: Date,
  notes: String,
  testUser: { type: Boolean, default: false }
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
      next(new Error(`Email address ${doc.email} is already registered.`))
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
  logger.info(
    `User with id: ${doc._id}, Email: ${doc.email} was updated.`,
    logSource
  )
})

userSchema.post('findOneAndDelete', function (doc, next) {
  logger.info(
    `User with id: ${doc._id}, Email: ${doc.email} was deleted.`,
    logSource
  )
  next()
})

const User = model('User', userSchema)
module.exports = User
