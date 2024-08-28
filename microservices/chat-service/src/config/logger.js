const { createLogger, format, transports } = require('winston')
require('winston-daily-rotate-file')
const { combine, timestamp, printf, errors, json } = format
const { config } = require('dotenv')
const dotenvExpand = require('dotenv-expand')

dotenvExpand.expand(config())

// Extracting environment variables after dotenv configuration
const env = process.env.NODE_ENV || 'development'
const serviceName = process.env.SERVICE_NAME || 'chat-service'
const logDir = process.env.LOG_DIR || 'logs'
const logLevel = process.env.LOG_LEVEL || 'debug'

// Define the custom console format
const consoleFormat = printf(({ level, message, timestamp, stack }) => {
  let msg = `${timestamp} [${serviceName}] ${level}: ${message}`
  if (stack) {
    msg += ` ${stack}`
  }
  return msg
})

// Create a daily rotate file transport for JSON logs
const dailyRotateFileTransport = new transports.DailyRotateFile({
  dirname: `${logDir}`,
  filename: `${serviceName}-%DATE%.log`,
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  defaultMeta: { serviceName },
  format: combine(
    timestamp(),
    errors({ stack: true }), // Include stack trace if available
    json() // Log in JSON format
  )
})

// Logger configuration
const logger = createLogger({
  level: env === 'development' ? logLevel : 'info', // More verbose logging in development
  format: combine(
    timestamp(),
    errors({ stack: true }) // Include stack trace if available
  ),
  transports: [
    // Console transport with a human-readable format
    new transports.Console({
      format: combine(
        format.colorize(), // Colorize log output for the console
        consoleFormat
      ),
      handleExceptions: true,
      level: env === 'development' ? logLevel : 'info' // More verbose logging in development
    }),
    // File transport with JSON format
    dailyRotateFileTransport
  ],
  exceptionHandlers: [
    new transports.File({
      filename: `${logDir}//exceptions.log`,
      format: json()
    })
  ],
  rejectionHandlers: [
    new transports.File({
      filename: `${logDir}/rejections.log`,
      format: json()
    })
  ]
})

// Exporting the logger and environment variables together
module.exports = logger
