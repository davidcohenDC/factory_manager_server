const winston = require('winston')
const { format, transports } = winston

const logger = winston.createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.json()),
  transports: [
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf((info) => {
          const { timestamp, level, message, ...meta } = info
          return `${timestamp} [${level}]: ${message} ${Object.keys(meta).length ? JSON.stringify(meta) : ''}`
        })
      )
    }),
    new transports.File({ filename: 'log/combined.log' })
  ],
  exceptionHandlers: [new transports.File({ filename: 'log/exceptions.log' })]
})

module.exports = logger
