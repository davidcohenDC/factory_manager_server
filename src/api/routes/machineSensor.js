const express = require('express')
const router = express.Router()
const { machineSensorController } = require('@controllers/machine-sensor/')
const pagination = require('@middlewares/pagination')
const { validateMachineSensorId } = require('@validations/machineSensor.validation')


router.post('/', machineSensorController.createMachineSensor)
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}),
    machineSensorController.getAllMachineSensors)
router.get('/id/:id', validateMachineSensorId, machineSensorController.getMachineSensorById)
router.get('/serial/:serial', pagination({itemsPerPage: 50, maxItemsPerPage: 100}),
    machineSensorController.getMachineSensorBySerial)

module.exports = router

