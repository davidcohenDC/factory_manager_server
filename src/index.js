const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const dotenvExpand = require('dotenv-expand');
const usersRouter = require('./routes/users');
const errorHandler = require('./middlewares/error');
const connectDB = require('./config/database');

dotenvExpand.expand(dotenv.config())

const app = express();

const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;
const DB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI;

const PORT = process.env.PORT || 4000;

// Connect to MongoDB
const connectToDatabase = () => {
    mongoose.connect(DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
        .then(() => console.log("Connected to MongoDB"))
        .catch(error => {
            console.error("Error connecting to MongoDB:", error);
            setTimeout(connectToDatabase, 5000); // Try reconnecting after 5 seconds
        });
}

connectToDatabase();

// Middlewares
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (req, res) => res.send('OK'));

// Routes
app.use('/api/users', usersRouter);

// Error handling middleware
app.use(errorHandler);

const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('Gracefully shutting down...');
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});

module.exports = server;  // For chai-http
