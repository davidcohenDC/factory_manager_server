const { generateResources } = require('@utils/helpers/crudHandler')
const MachineSensor = require('@models/machineSensor')

module.exports = {
    machineSensorCRUD: generateResources(MachineSensor, 'machineSensor')
}