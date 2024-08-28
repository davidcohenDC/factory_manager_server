const { logger } = require('/src/config/logger')

const logSource = 'Metrics Controller'

module.exports = {
  sendMetrics: (io) => {
    logger.info('Sending metrics', { source: logSource })
    io.emit('metrics', { message: 'Metrics sent' })
  }
}
