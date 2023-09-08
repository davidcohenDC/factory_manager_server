// const mongoose = require('mongoose');
// const dotenv = require('dotenv');
// const dotenvExpand = require("dotenv-expand");
//
// // Load environment variables
// dotenvExpand.expand(dotenv.config())
//
// const DB_URI = process.env.DB_URI;
//
// // function connectDB() {
// //     return mongoose.connect(DB_URI, {
// //         useNewUrlParser: true,
// //         useUnifiedTopology: true,
// //         poolSize: 10 // Increase this setting as needed.
// //     });
// // }
//
// mongoose.connection.on('connected', function () {
//     console.log('Mongoose connected to ' + DB_URI);
// });
//
// mongoose.connection.on('error', function (err) {
//     console.log('Mongoose connection error: ' + err);
// });
//
// mongoose.connection.on('disconnected', function () {
//     console.log('Mongoose disconnected');
// });
//
// // Reconnect when closed
// mongoose.connection.on('disconnected', function () {
//     connectDB();
// });
//
// process.on('SIGINT', function () {
//     mongoose.connection.close(function () {
//         console.log('Mongoose disconnected through app termination');
//         process.exit(0);
//     });
// });
//
// // module.exports = connectDB;
