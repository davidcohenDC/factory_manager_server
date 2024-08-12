const express = require('express')
const router = express.Router()
const {validateMachineBody, validateMachineId } = require('@validations/machine.validation')
const { machineController } = require('@controllers/machine/')
const { pagination } = require('@middlewares/')

router.post('/',  validateMachineBody, machineController.createMachine)
router.get('/', pagination({itemsPerPage: 50, maxItemsPerPage: 100}), machineController.getAllMachines)
router.get('/id/:id', validateMachineId, machineController.getMachineById)
router.patch('/id/:id', validateMachineId, machineController.updateMachineById)
router.delete('/id/:id', validateMachineId, machineController.deleteMachineById)
router.get('/serial/:serial', machineController.getMachineBySerial)

module.exports = router
