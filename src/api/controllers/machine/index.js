const { generateResources } = require('@utils/helpers/crudHandler');
const Machine = require('@models/machine');

module.exports = {
  machineCRUD: generateResources(Machine, 'machine',
      { create: true, read: true, update: true, delete: true })
}
