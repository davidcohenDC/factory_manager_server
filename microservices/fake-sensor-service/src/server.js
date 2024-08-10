require('module-alias/register');
require('dotenv').config();
const express = require('express');
const http = require('http');
const mongoose = require('mongoose');
const socketIo = require('socket.io');
const path = require('path');
const { port } = require('@config/');
const { logger } = require('@config/');
const { app, start } = require('./app');

const logSource = { source: 'Express Server' };

const startServer = async () => {
    try {
        const server = http.createServer(app);
        const io = socketIo(server);

        io.on('connection', (socket) => {
            logger.info('Client connected');
            socket.on('disconnect', () => {
                logger.info('Client disconnected');
            });
        });

        await start(io);
        logger.info('Server started');

        server.listen(port, () => {
            logger.info(`Server is running on port ${port}`, logSource);
        });

        process.on('SIGINT', () => {
            logger.info('Gracefully shutting down...', logSource);
            server.close(async () => {
                logger.info('Server is closed', logSource);
                try {
                    await mongoose.disconnect();
                    logger.info('Mongoose disconnected', logSource);
                    process.exit(0);
                } catch (err) {
                    logger.error('Error while disconnecting from Mongoose', logSource);
                    process.exit(1);
                }
            });
        });

        // Log any unhandled rejections and uncaught exceptions
        process.on('unhandledRejection', (reason, promise) => {
            logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
        });

        process.on('uncaughtException', (error) => {
            logger.error('Uncaught Exception thrown:', error);
            process.exit(1); // Exit the process to avoid undefined states
        });

    } catch (error) {
        logger.error('Error starting server:', error);
        process.exit(1);
    }
};

// Serve the HTML file
app.use(express.static(path.join(__dirname, '..', 'public')));

startServer().then((r) => r);
