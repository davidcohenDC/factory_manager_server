const express = require('express')
const router = express.Router()
const {
  validateMachineBody,
  validateMachineId
} = require('@validations/machine.validation')
const { machineCRUD } = require('@controllers/machine/')
const pagination = require('@middlewares/pagination')
const { tagTest } = require('@middlewares/')

// CRUD operations for machine

// CREATE a new machine
router.post('/', validateMachineBody, tagTest, machineCRUD.create)

// RETRIEVE all machines
router.get(
  '/',
  pagination({
    itemsPerPage: 50,
    maxItemsPerPage: 100
  }),
  machineCRUD.getAll
)

// RETRIEVE a single machine by ID
router.get('/:id', validateMachineId, machineCRUD.getOne)

// UPDATE a machine by ID
router.patch('/:id', validateMachineId, machineCRUD.update)

// DELETE a machine by ID

router.delete('/:id', validateMachineId, machineCRUD.remove)

module.exports = router
