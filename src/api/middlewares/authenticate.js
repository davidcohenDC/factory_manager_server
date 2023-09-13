
const expressJwt = require('express-jwt');
const jwtBlacklist = require('express-jwt-blacklist');

const jwtSecretKey = process.env.JWT_SECRET_KEY; // From environment variable

jwtBlacklist.configure({
    tokenId: 'jti', // the JWT token identifier key
    strict: true,
    store: {
        type: 'memcached',
        host: 'localhost',
        port: 11211,
        keyPrefix: 'blacklist:',
        options: {
            timeout: 10 // Blacklist cache timeout in seconds
        }
    }
});

// Utility function to send error response
function sendErrorResponse(res, statusCode, message) {
    return res.status(statusCode).json({ error: message });
}

// Function to extract token from Authorization header
function extractToken(req) {
    if (!req.header('Authorization') || !req.header('Authorization').startsWith('Bearer ')) {
        return null;
    }
    return req.header('Authorization').split(' ')[1];
}

module.exports = (req, res, next) => {
    const token = extractToken(req);

    if (!token) {
        return sendErrorResponse(res, 401, 'Access denied. Token not provided or format incorrect.');
    }

    // Validate the token
    expressJwt({ secret: jwtSecretKey, isRevoked: jwtBlacklist.isRevoked })(req, res, error => {
        if (error) {
            if (error.code === 'invalid_token') {
                return sendErrorResponse(res, 401, 'Invalid token');
            }
            return sendErrorResponse(res, 500, 'Failed to authenticate token');
        }
        next();
    });
};
