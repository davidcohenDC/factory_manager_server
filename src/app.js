const express = require('express');
const {port} = require("./config");
const loader = require('./loaders/index.js');
const app = express();
loader(app).then(r => console.log('Server is loaded'));

const server = app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

module.exports = server;  // For chai-http
