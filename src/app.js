const express = require('express')
const { port } = require('./config')
const loader = require('./loaders/index.js')
const app = express()
loader(app).then(() => console.log('Server is loaded'))

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})

process.on('SIGINT', () => {
  console.log('Gracefully shutting down...')
  server.close(() => {
    // logEvent('00005', null, 'info', 'Server is closed')
    process.exit(0)
  })
})

module.exports = server // For chai-http
