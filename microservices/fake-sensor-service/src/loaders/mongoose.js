// src/loaders/mongoose.js
const mongoose = require('mongoose');
const { dbUri } = require('@config/');
const { logger } = require('@config/');

const sourceName = 'MongoDB Connection';

module.exports = async () => {
    mongoose.set('strictQuery', false);

    await mongoose.connect(dbUri);
    logger.info('Successfully connected to MongoDB', { source: sourceName });

    mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error', { error, source: sourceName });
        throw error; // Allow the global error handler to manage this
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection disconnected', { source: sourceName });
    });

    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB connection reconnected', { source: sourceName });
    });
};
