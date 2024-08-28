const express = require('express')
const router = express.Router()
const { areaController } = require('@controllers/area/')
const {
  validateAreaId,
  validateAreaBody
} = require('@validations/area.validation')
const { pagination } = require('@middlewares/')

router.post('/', validateAreaBody, areaController.createArea)
router.get(
  '/',
  pagination({
    itemsPerPage: process.env.ITEMS_PER_PAGE,
    maxItemsPerPage: 100
  }),
  areaController.getAllAreas
)
router.get('/id/:id', validateAreaId, areaController.getAreaById)
router.patch('/id/:id', validateAreaId, areaController.updateAreaById)
router.delete('/id/:id', validateAreaId, areaController.deleteAreaById)
router.get('/name/:name', areaController.getAreaByName)

module.exports = router
