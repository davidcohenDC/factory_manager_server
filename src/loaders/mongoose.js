const mongoose = require('mongoose');
const { dbUri } = require('@config/');
const { logger } = require('@config/');  // Adjust the path to your logger file

module.exports = async () => {
    mongoose.set('strictQuery', false);

    await mongoose
        .connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(() => {
            logger.info('Successfully connected to MongoDB');
        })
        .catch((err) => {
            logger.error('Error connecting to MongoDB:', err);
        });

    mongoose.connection.on('error', (error) => {
        logger.error('MongoDB connection error:', error);
    });

    mongoose.connection.on('disconnected', () => {
        logger.warn('MongoDB connection disconnected');
    });

    mongoose.connection.on('reconnected', () => {
        logger.info('MongoDB connection reconnected');
    });
};
