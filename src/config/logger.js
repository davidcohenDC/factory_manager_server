const winston = require('winston');
const { format, transports } = winston;

const logLevel = process.env.LOG_LEVEL || 'info';

// Increase the listener limit for the file transport
transports.File.prototype.setMaxListeners(20);

const customTransports = {
    console: new winston.transports.Console({
        level: logLevel,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(({ timestamp, level, message, label, ...metadata }) => {
                let output = `${timestamp} [${level}]`;

                if (label) {
                    output += ` [${label}]`;
                }

                output += `: ${message}`;

                if (metadata.req) {
                    const { method, originalUrl, ip } = metadata.req;
                    output += `
            Method: ${method}
            Path: ${originalUrl}
            IP: ${ip}
          `;
                }

                if (level === 'error') {
                    const { user, error } = metadata;
                    output += `
            User: ${user || 'N/A'}
            Error Status: ${error ? error.status : ''}
          `;
                } else if (level === 'warn') {
                    const { path, statusCode, headers } = metadata;
                    output += `
            Path: ${path}
            Status Code: ${statusCode}
            Headers: ${JSON.stringify(headers, null, 2)}
          `;
                }

                return output;
            })
        ),
        handleExceptions: true,
    }),
    fileError: new transports.File({
        filename: 'logs/error.log',
        level: 'error',
        format: winston.format.combine(
            winston.format.json(),
            winston.format.prettyPrint()
        ),
    }),
    fileException: new transports.File({
        filename: 'logs/exceptions.log',
        handleExceptions: true,
    }),
    file: new transports.File({
        filename: 'logs/combined.log',
        level: logLevel,
    }),
    rejectionFile: new transports.File({ filename: 'logs/rejections.log' }),
};

const baseLogger = winston.createLogger({
    format: format.combine(
        format.timestamp(),
        format.splat(),
        format.errors({ stack: true }),
        format.printf(({ timestamp, level, message, label, ...metadata }) => {
            let output = `${timestamp} [${level}]`;

            if (label) {
                output += ` [${label}]`;
            }

            output += `: ${message}`;

            if (metadata.req) {
                const { method, originalUrl, ip } = metadata.req;
                output += `
        Method: ${method}
        Path: ${originalUrl}
        IP: ${ip}
      `;
            }

            if (level === 'error') {
                const { user, error } = metadata;
                output += `
        User: ${user || 'N/A'}
        Error Status: ${error ? error.status : ''}
      `;
            } else if (level === 'warn') {
                const { path, statusCode, headers } = metadata;
                output += `
        Path: ${path}
        Status Code: ${statusCode}
        Headers: ${JSON.stringify(headers, null, 2)}
      `;
            }

            return output;
        })
    ),
    transports: [
        customTransports.console,
        customTransports.fileError,
        customTransports.file,
    ],
    exceptionHandlers: [customTransports.fileException],
    rejectionHandlers: [customTransports.rejectionFile],
});

// Wrapper function to add logSource dynamically
function logWithSource(logSource) {
    const wrapper = {};
    const methods = ['info', 'warn', 'error', 'debug'];

    methods.forEach(method => {
        wrapper[method] = (message, ...meta) => {
            baseLogger[method](message, { label: logSource, ...meta });
        };
    });

    return wrapper;
}

// Export both the standard logger and the logger factory
const logger = logWithSource('Default');

module.exports = {
    logger,
    logWithSource,
};
