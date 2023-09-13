const mongoose = require('mongoose')
const { Schema, model } = mongoose
const bcrypt = require('bcrypt')

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
    this.password = await bcrypt.hash(this.password, 10)
  }
  next()
})

const User = model('User', userSchema)
module.exports = User
