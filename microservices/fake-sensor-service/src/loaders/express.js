const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {logger } = require('@config/')
const logSource = { source: 'Express Loader' }

module.exports = (app) => {
    process.on('uncaughtException', (error) => {
        logger.error(`Uncaught Exception: ${error.message}`, {
            ...logSource,
            error
        })
        process.exit(1)
    })

    process.on('unhandledRejection', (reason, promise) => {
        logger.error(`Unhandled Rejection at Promise`, {
            ...logSource,
            reason,
            promise
        })
    })

    app.use(cors())
    app.use(bodyParser.json({ limit: '20mb' }))
    app.use(bodyParser.urlencoded({ limit: '20mb', extended: true }))
    app.use(express.static('public'))
    app.get('/health', (_req, res) => res.send({ status: 'OK' }))
}
