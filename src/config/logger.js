const DailyRotateFile = require('winston-daily-rotate-file')
const winston = require('winston')
const { format, transports } = winston

// Custom formatter for logs.
// const customFormat = format.printf(({ timestamp, level, message, ...metadata }) => {
//   let metaString = Object.keys(metadata).length ? JSON.stringify(metadata) : "";
//   return `${timestamp} [${level}]: ${message} ${metaString}`;
// });

// Get the log level from environment variables or set to 'info' as default.
const logLevel = process.env.LOG_LEVEL || 'info'

// const logDir = 'logs/';

// Daily log rotation configuration.
const dailyRotateFileTransport = new DailyRotateFile({
  dirname: 'daily_logs',
  filename: 'application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'trace' // Captures everything.
})

// Individual transport configurations for modularization and clarity.
const customTransports = {
  console: new winston.transports.Console({
    level: logLevel,
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        //if metadatada.source is not defined we dont want to print undefined
        let output = ``
        if (metadata.source === undefined) {
          output = `${timestamp} [${level}]: ${message}`
        } else {
          output = `${timestamp} [${level}]: [${metadata.source}] ${message}`
        }

        if (metadata.req) {
          const { method, originalUrl, ip } = metadata.req
          output += `
              Method: ${method}
              Path: ${originalUrl}
              IP: ${ip}
            `
        }

        if (level === 'error') {
          const { user, error } = metadata
          output += `
              User: ${user ? user : 'N/A'}
              Error Status: ${error ? error.status : ''}
            `
        } else if (level === 'warn') {
          const { path, statusCode, headers } = metadata
          output += `
              Path: ${path}
              Status Code: ${statusCode}
              Headers: ${JSON.stringify(headers, null, 2)}
            `
        }

        return output
      })
    ),
    handleExceptions: true
  }),
  fileError: new transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.json(),
      winston.format.colorize(),
      winston.format.prettyPrint()
    )
  }),
  fileException: new transports.File({
    filename: 'logs/exceptions.log',
    handleExceptions: true
  }),
  file: new transports.File({
    filename: 'logs/combined.log',
    level: logLevel
  }),
  rejectionFile: new transports.File({ filename: 'logs/rejections.log' }),
  dailyRotateFile: dailyRotateFileTransport
}

// Winston logger configuration.
const logger = winston.createLogger({
  format: format.combine(
    format.timestamp(),
    format.splat(),
    winston.format.colorize(),
    format.errors({ stack: true }) // Enables logging of error stack trace.
  ),
  transports: [
    customTransports.console,
    customTransports.fileError,
    customTransports.file,
    customTransports.dailyRotateFile
  ],
  exceptionHandlers: [customTransports.fileException],
  rejectionHandlers: [customTransports.rejectionFile]
})

module.exports = logger
