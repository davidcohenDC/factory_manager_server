const express = require('express')
const router = express.Router()
const { getByMachine, machineSensorCRUD } = require('@controllers/machineSensor/')
const pagination = require('@middlewares/pagination')
const { validateMachineSensorId } = require('@validations/machineSensor.validation')
const { validateMachineId } = require('@validations/machine.validation')


// GET all machineSensors
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}), machineSensorCRUD.getAll)
router.get('/id/:id', validateMachineSensorId, machineSensorCRUD.getOne)

// GET machineSensor by machineId
router.get('/machineId/:machineId',
pagination({itemsPerPage: 50, maxItemsPerPage: 100}), getByMachine)

module.exports = router

