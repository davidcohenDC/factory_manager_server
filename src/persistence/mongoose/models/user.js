const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt');
const { logWithSource } = require('@config/');
const logger = logWithSource('UserSchema');

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
  department: String,
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
      enum: ['en', 'es', 'fr', 'it'],
      default: 'en'
    }
  },
  accessibility: {
    colorFilter: {
      type: String,
      enum: ['normal', 'protanopia', 'deuteranopia', 'tritanopia'],
      default: 'normal'
    }
  },
  socialLinks: {
    linkedin: String,
    twitter: String
  },
  joinedDate: Date,
  notes: String,
  test: { type: Boolean }
});

// Indexing
userSchema.index({ email: 1 });

// Virtual for fullName
userSchema
    .virtual('fullName')
    .get(function () {
      return this.name.first + ' ' + this.name.last;
    })
    .set(function (value) {
      const parts = value.split(' ');
      this.name.first = parts[0];
      this.name.last = parts[1];
    });

// Pre-save hook for hashing password
userSchema.pre('save', async function (next) {
  logger.info('Pre save hook called');
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
      logger.info(`Password hashed for user with email: ${this.email}`);
    } catch (error) {
      logger.error(`Error hashing password for user ${this.email}: ${error.message}`);
      return next(error);
    }
  }
  next();
});

// Post-save hook for catching errors
userSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      logger.error(`Duplicate key error (MongoServerError): E11000 duplicate key error on email: ${JSON.stringify(err.keyValue)}`);
      return next(new Error('User with this email already exists.'));
    } else {
      logger.error(`Error saving user: ${err.message}`);
      return next(err);
    }
  }
  next();
});

// Post-validate hook
userSchema.post('validate', function (doc) {
  logger.info(`User with id: ${doc._id}, Email: ${doc.email} passed validation.`);
});

// Post-update hook
userSchema.post('findOneAndUpdate', function (doc) {
  if (doc) {
    logger.info(`User with id: ${doc._id}, Email: ${doc.email} was updated.`);
  } else {
    logger.warn('No user was found to update.');
  }
});

// Post-delete hook
userSchema.post('findOneAndDelete', function (doc) {
  if (doc) {
    logger.info(`User with id: ${doc._id}, Email: ${doc.email} was deleted.`);
  } else {
    logger.warn('No user was found to delete.');
  }
});

const User = model('User', userSchema);
module.exports = User;
