module.exports = (socket, next) => {
    // Example: Authenticate the socket by checking a passed token or any other method
    if (socket.handshake.query.token) {
        // Logic to validate the token
        next();
    } else {
        next(new Error('Authentication Error'));
    }
};