const { Router } = require('express')
const UserRoutes = require('@routes/user')
const MachineRoutes = require('@routes/machine')
const AreaRoutes = require('@routes/area')
const router = Router()
const swaggerJsdoc = require('swagger-jsdoc')
const { serve, setup } = require('swagger-ui-express')
const { specs, swaggerConfig } = require('../../config/index.js')

// Now generate the specDoc
const specDoc = swaggerJsdoc(swaggerConfig)

router.use(specs, serve)
router.get(specs, setup(specDoc, { explorer: true }))
router.use('/user', UserRoutes)
router.use('/machine', MachineRoutes)
router.use('/area', AreaRoutes)

module.exports = router
