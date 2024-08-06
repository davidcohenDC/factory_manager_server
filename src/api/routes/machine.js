const express = require('express')
const router = express.Router()
const {validateMachineBody, validateMachineId} = require('@validations/machine.validation')
const { machineCRUD } = require('@controllers/machine/')
const pagination = require('@middlewares/pagination')
const { tagTest } = require('@middlewares/')

// CRUD operations for machine

router.post('/',  tagTest, machineCRUD.create)
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}), machineCRUD.getAll)
router.get('/id/:id', validateMachineId, machineCRUD.getOne)
router.patch('/id/:id', validateMachineId, machineCRUD.update)
router.delete('/id/:id', validateMachineId, machineCRUD.remove)

module.exports = router
