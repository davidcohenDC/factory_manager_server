const { logger } = require('@config/');
const fs = require('fs');

function backupLogger(message) {
    const timestamp = new Date().toISOString();
    const formattedMessage = `[${timestamp}] BACKUP: ${message}\n`;
    fs.appendFile('backup.log', formattedMessage, err => {
        if (err) console.error('Failed to write to backup.log');
    });
}

function logMiddleware(req, res, next) {
    const start = Date.now();

    function logRequest() {
        try {
            const { method, url, headers, body, query, ip } = req;
            const duration = Date.now() - start;

            let logDetails = {
                method,
                path: url,
                ip
            };

            if (res.statusCode >= 500) {
                logDetails.errorStatus = res.statusCode;
                if (body && body.error) {
                    logDetails.errorMessage = body.error;
                }
                if (req.user) {
                    logDetails.user = req.user;
                }
                logger.error(`[${method}] ${url} - ${res.statusCode} [${duration}ms]`, logDetails);
            } else if (res.statusCode >= 400) {
                logDetails.statusCode = res.statusCode;
                logDetails.headers = headers;
                logger.warn(`[${method}] ${url} - ${res.statusCode} [${duration}ms]`, logDetails);
            } else {
                logger.info(`[${method}] ${url} - ${res.statusCode} [${duration}ms]`);
            }
        } catch (error) {
            // If there's an error with the primary logger, use the backup
            backupLogger(`Logging error: ${error.message}. Original request: ${req.method} ${req.url}`);
        }
    }

    res.on('finish', logRequest);
    next();
}

module.exports = logMiddleware;
