// Importa Express

const express = require('express');
const { initializeSocket } = require('./src/sockets/')
const http = require("http");

const port = 5000;

const startServer = async () => {
    // Crea un'istanza dell'applicazione Express
    const app = express();
    app.get('/', (req, res) => {
        res.send('Hello, Im Area Service!');
    });

    const server = http.createServer(app)
    await initializeSocket(server) // Initialize the socket.io server
    server.listen(port, () => {
       console.log(`Server is running on port ${port}`)
    })
    return server
}

startServer().then((r) => r)

