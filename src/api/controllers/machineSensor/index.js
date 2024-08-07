const { getByMachine } = require('@controllers/machineSensor/getByMachine')
const { generateResources } = require('@utils/helpers/crudHandler')
const MachineSensor = require('@models/machineSensor')

module.exports = {
    getByMachine,
    machineSensorCRUD: generateResources(MachineSensor, 'machineSensor',
        { create: false, read: true, update: false, delete: false })
}