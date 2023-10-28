const { generateResources } = require('@utils/helpers/crudHandler')
const Machine = require('@models/')

module.exports = {
  machineCRUD: generateResources(Machine, 'machine')
}
