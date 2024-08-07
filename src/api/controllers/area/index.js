const { generateResources } = require('@utils/helpers/crudHandler');
const Area = require('@models/area');

module.exports = {
  areaCRUD: generateResources(Area, 'area',
      { create: true, read: true, update: true, delete: true })
}
