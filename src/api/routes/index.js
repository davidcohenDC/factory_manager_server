const { Router } = require('express')
const UserRoutes = require('../routes/user')
const { userCRUDSpecs } = require('../controllers/user')
const router = Router()
const swaggerJsdoc = require('swagger-jsdoc')
const { serve, setup } = require('swagger-ui-express')
const { specs, swaggerConfig } = require('../../config/index.js')

// Update paths before generating specDoc
Object.assign(swaggerConfig.swaggerDefinition.paths, userCRUDSpecs.paths)

// Now generate the specDoc
let specDoc = swaggerJsdoc(swaggerConfig)

router.use(specs, serve)
router.get(specs, setup(specDoc, { explorer: true }))
router.use('/user', UserRoutes)

module.exports = router
