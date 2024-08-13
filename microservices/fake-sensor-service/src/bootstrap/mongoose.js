const mongoose = require('mongoose');
const { dbUri, logger } = require('@config/');
const logSource = { source: 'MongoDB Connection' };

/**
 * Initialize and manage MongoDB connection.
 */
module.exports = async () => {
    logger.info('Connecting to MongoDB...', logSource);

    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect(dbUri);
        logger.info('Successfully connected to MongoDB.', logSource);

        mongoose.connection.on('error', (error) => {
            logger.error('MongoDB connection error:', { error, ...logSource });
            throw error;
        });

        mongoose.connection.on('disconnected', () => {
            logger.warn('MongoDB connection disconnected.', logSource);
        });

        mongoose.connection.on('reconnected', () => {
            logger.info('MongoDB connection reconnected.', logSource);
        });
    } catch (error) {
        logger.error('Failed to connect to MongoDB:', { error, ...logSource });
        throw error;
    }
};
