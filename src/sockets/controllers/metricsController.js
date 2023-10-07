const { logger } = require('@root/config')

const logSource = { source: 'Metrics Controller' }

module.exports = {
  sendMetrics: (io) => {
    logger.info('Sending metrics', logSource)
    io.emit('metrics', { message: 'Metrics sent' })
  }
}
