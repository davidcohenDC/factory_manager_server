const { v4: uuidv4 } = require('uuid')

// Express middleware to add a unique trace ID to each request
const traceMiddleware = (req, res, next) => {
  // Check if the incoming request has a trace ID, otherwise generate a new one
  const traceId = req.headers['x-trace-id'] || uuidv4()
  // Assign the trace ID to the request object
  req.traceId = traceId
  // Set the trace ID in the response header to ensure the calling service can correlate responses
  res.setHeader('x-trace-id', traceId)
  next()
}

module.exports = traceMiddleware
