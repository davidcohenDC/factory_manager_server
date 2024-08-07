const { logger } = require('@config/');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

const logSource = { source: 'Log Middleware' };

function backupLogger(message) {
  const timestamp = new Date().toISOString();
  const formattedMessage = `[${timestamp}] BACKUP: ${message}\n`;
  fs.appendFile('backup.log', formattedMessage, (err) => {
    if (err) console.error('Failed to write to backup.log');
  });
}

function logMiddleware(req, res, next) {
  const requestId = uuidv4();
  req.requestId = requestId;
  res.setHeader('X-Request-Id', requestId);

  const start = Date.now();
  const { method, url, headers, ip } = req;

  function logRequest() {
    try {
      const duration = Date.now() - start;
      const logDetails = {
        ...logSource,
        method,
        path: url,
        ip,
        duration: `${duration}ms`,
        requestId,
        user: req.user ? req.user._id : null,
        statusCode: res.statusCode,
      };

      if (res.statusCode >= 500) {
        logDetails.level = 'error';
        logDetails.message = `[${method}] ${url} - ${res.statusCode}`;
        if (req.body && req.body.error) {
          logDetails.errorMessage = req.body.error;
        }
      } else if (res.statusCode >= 400) {
        logDetails.level = 'warn';
        logDetails.message = `[${method}] ${url} - ${res.statusCode}`;
        logDetails.headers = headers;
      } else {
        logDetails.level = 'info';
        logDetails.message = `[${method}] ${url} - ${res.statusCode}`;
      }

      logger.log(logDetails.level, logDetails.message, logDetails);
    } catch (error) {
      // If there's an error with the primary logger, use the backup
      backupLogger(`Logging error: ${error.message}. Original request: ${method} ${url}`);
    }
  }

  res.on('finish', logRequest);
  next();
}

module.exports = logMiddleware;
