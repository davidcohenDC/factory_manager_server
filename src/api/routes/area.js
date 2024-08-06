const express = require('express')
const router = express.Router()
const { areaCRUD } = require('@controllers/area/')
const { validateAreaId } = require('@validations/area.validation')
const pagination = require('@middlewares/pagination')
const { tagTest } = require('@middlewares/')

// CRUD operations for area

router.post('/', tagTest, areaCRUD.create)
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}), areaCRUD.getAll)
router.get('/id/:id', validateAreaId, areaCRUD.getOne)
router.patch('/id/:id', validateAreaId, areaCRUD.update)
router.delete('/id/:id', validateAreaId, areaCRUD.remove)

module.exports = router
