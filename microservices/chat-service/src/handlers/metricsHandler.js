const { logger } = require('../config/logger')

const logSource = { source: 'Metric Handler' }

const sendMetrics = (socket) => {
  logger.info('Sending metrics', logSource)
  const metrics = {
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage().rss
  }
  socket.broadcast.emit('metrics', '')
}

module.exports = {
  sendMetrics
}
