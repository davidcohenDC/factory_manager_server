const express = require('express')
const router = express.Router()
const { machineCRUD } = require('@controllers/machine/')
const pagination = require('@middlewares/pagination')

// CRUD operations for machine

// CREATE a new machine
router.post('/', machineCRUD.create)

// RETRIEVE all machines
router.get('/', pagination({
    itemsPerPage: 50,
    maxItemsPerPage: 100
}), machineCRUD.getAll)

// RETRIEVE a single machine by ID
router.get('/:id', machineCRUD.getOne)

// UPDATE a machine by ID
router.patch('/:id', machineCRUD.update)

// DELETE a machine by ID

router.delete('/:id', machineCRUD.remove)

module.exports = router