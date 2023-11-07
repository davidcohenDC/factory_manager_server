const metricsController = require('../controllers/metricsController')
const { logger } = require('/src/config')
const logSource = 'Metrics Events'
module.exports = (io) => {
  io.on('connection', (socket) => {
    socket.on('metrics', () => {
      metricsController.sendMetrics(io)
    })

    socket.on('disconnect', () => {
      logger.info('User disconnected', {source: logSource})
    })
  })
}
