const express = require('express');
const {port} = require("./config");
const loader = require('./loaders/index.js');
const usersRouter = require('./api/routes/users.js');

const app = express();
loader(app);


// const DB_URI = process.env.NODE_ENV === 'test' ? process.env.TEST_DB_URI : process.env.DB_URI;
//
// const PORT = process.env.PORT || 4000;
//
// // Connect to MongoDB
// const connectToDatabase = () => {
//     mongoose.connect(DB_URI, {
//         useNewUrlParser: true,
//         useUnifiedTopology: true
//     })
//         .then(() => console.log("Connected to MongoDB"))
//         .catch(error => {
//             console.error("Error connecting to MongoDB:", error);
//             setTimeout(connectToDatabase, 5000); // Try reconnecting after 5 seconds
//         });
// }
//
// connectToDatabase();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// Health check
app.get('/health', (req, res) => res.send('OK'));



// Error handling middleware
// app.use(errorHandler);

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
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
