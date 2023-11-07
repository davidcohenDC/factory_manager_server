const { logger } = require('/src/config/logger')

const logSource = { source: 'Metrics Controller' }

module.exports = {
  sendMetrics: (io) => {
    logger.info('Sending metrics', logSource)
    io.emit('metrics', { message: 'Metrics sent' })
  }
}
