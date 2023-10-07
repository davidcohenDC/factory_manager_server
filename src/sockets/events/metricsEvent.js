const metricsController = require('../controllers/metricsController')
const { logger } = require('@root/config')

const logSource = { source: 'Metrics Events' }
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('metrics', () => {
      metricsController.sendMetrics(io)
    })

    socket.on('disconnect', () => {
      logger.info('User disconnected', logSource)
    })
  })
}
