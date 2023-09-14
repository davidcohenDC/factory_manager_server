const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcrypt')
const { logger } = require('@config/')

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
userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    try {
      this.password = await bcrypt.hash(this.password, 10);
    } catch (error) {
      logger.error(`Error hashing password for user ${this.email}: ${error.message}`);
      next(error);
    }
  }
  next();
});

// This hook handles errors after saving
userSchema.post('save', function (err, doc, next) {
  if (err) {
    if (err.name === 'MongoServerError' && err.code === 11000) {
      next(new Error(`Email address ${doc.email} is already registered.`));
    } else {
      // Handle other errors or just pass them along
      next(err);
    }
  } else {
    next();
  }
});

// This hook runs after saving, when there's no error
userSchema.post('save', function (doc) {
  logger.info(`User with id: ${doc._id} was saved.`);
});

userSchema.post('validate', function (doc) {
  logger.info(`User with id: ${doc._id} passed validation.`);
});

userSchema.post('findOneAndUpdate', function (doc) {
    logger.info(`User with id: ${doc._id} was updated.`);
})

userSchema.post('findOneAndDelete', function (doc, next) {
    logger.info(`User with id: ${doc._id} was deleted.`);
    next();
})


const User = model('User', userSchema);
module.exports = User;
