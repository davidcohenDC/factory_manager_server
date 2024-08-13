const express = require('express')
const router = express.Router()
const { machineSensorController } = require('@controllers/machineSensor/')
const { pagination } = require('@middlewares/')
const { validateMachineSensorId, validateMachineSensorBody } = require('@validations/machineSensor.validation')


router.post('/', validateMachineSensorBody, machineSensorController.createMachineSensor)
router.get('/', pagination({itemsPerPage: process.env.ITEMS_PER_PAGE, maxItemsPerPage: 100}),
    machineSensorController.getAllMachineSensors)
router.get('/id/:id', validateMachineSensorId, machineSensorController.getMachineSensorById)
router.get('/serial/:serial', pagination({itemsPerPage: process.env.ITEMS_PER_PAGE, maxItemsPerPage: 100}),
    machineSensorController.getMachineSensorBySerial)

module.exports = router

