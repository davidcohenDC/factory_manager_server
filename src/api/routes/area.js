const express = require('express')
const router = express.Router()
const { areaCRUD } = require('@controllers/area/')
const {
  validateAreaBody,
  validateAreaId
} = require('@validations/area.validation')
const pagination = require('@middlewares/pagination')
const { tagTest } = require('@middlewares/')

// CRUD operations for area

// CREATE a new area
router.post('/', tagTest, areaCRUD.create)

// RETRIEVE all ares
router.get(
  '/',
  pagination({
    itemsPerPage: 50,
    maxItemsPerPage: 100
  }),
  areaCRUD.getAll
)

// RETRIEVE a single area by ID
router.get('/:id', validateAreaId, areaCRUD.getOne)

// UPDATE an area by ID
router.patch('/:id', validateAreaId, areaCRUD.update)

// DELETE an area by ID
router.delete('/:id', validateAreaId, areaCRUD.remove)

module.exports = router
