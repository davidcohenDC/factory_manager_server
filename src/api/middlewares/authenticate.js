const expressJwt = require('express-jwt')
const jwtBlacklist = require('express-jwt-blacklist')
const { logger } = require('@config/')
const { host, port, jwtSecretKey } = require('@config/')
const logSource = { source: 'JWT Middleware' }

jwtBlacklist.configure({
  tokenId: 'jti', // the JWT token identifier key
  strict: true,
  store: {
    type: 'memcached',
    host: host,
    port: port,
    keyPrefix: 'blacklist:',
    options: {
      timeout: 10 // Blacklist cache timeout in seconds
    }
  }
})

function sendErrorResponse(res, statusCode, message) {
  logger.error(`[Code: ${statusCode}] - ${message}`, logSource)
  return res.status(statusCode).json({ error: message })
}

function extractToken(req) {
  if (
    !req.header('Authorization') ||
    !req.header('Authorization').startsWith('Bearer ')
  ) {
    return null
  }
  return req.header('Authorization').split(' ')[1]
}

module.exports = (req, res, next) => {
  const token = extractToken(req)

  if (!token) {
    return sendErrorResponse(
      res,
      401,
      'Access denied. Token not provided or format incorrect.'
    )
  }

  // Validate the token
  expressJwt({ secret: jwtSecretKey, isRevoked: jwtBlacklist.isRevoked })(
    req,
    res,
    (error) => {
      if (error) {
        if (error.code === 'invalid_token') {
          return sendErrorResponse(res, 401, 'Invalid token')
        }
        return sendErrorResponse(res, 500, 'Failed to authenticate token')
      }
      next()
    }
  )
}
