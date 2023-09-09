const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        first: String,
        last: String
    },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    dataOfBirth: Date,
    address: {
        street: String,
        city: String,
        state: String,
        zip: String,
        country: String
    },
    phoneNumbers: [{
        type: {
            type: String,
            enum: ['mobile'], // Add more types if necessary
        },
        number: String
    }],
    role: {
        type: String,
        enum: ['administrator,  moderator, worker'] // Add more roles if necessary
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
            enum: ['light', 'dark'],  // Ensure 'light' is in the enum list
            default: 'light'
        },
        language: {
            type: String,
            enum: ['en', 'es', 'fr'],  // Ensure 'en' is in the enum list
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
});
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

module.exports = mongoose.model('User', userSchema);


