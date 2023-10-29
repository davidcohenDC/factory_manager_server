const { Router } = require('express')
const UserRoutes = require('@routes/user')
const MachineRoutes = require('@routes/machine')
const AreaRoutes = require('@routes/area')
const router = Router()
const swaggerJsdoc = require('swagger-jsdoc')
const { serve, setup } = require('swagger-ui-express')
const { specs, swaggerConfig, prefix } = require('@config/')

// Now generate the specDoc
const specDoc = swaggerJsdoc(swaggerConfig)

router.use(specs, serve)
router.get(specs, setup(specDoc, { explorer: true }))
router.use('/user', UserRoutes)
router.use('/machine', MachineRoutes)
router.use('/area', AreaRoutes)

// Redirect from root to /docs
router.use((_req, res, _next) => {
    res.redirect(prefix+specs);
});

module.exports = router
