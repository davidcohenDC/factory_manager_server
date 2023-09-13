const { generateResources } = require('@utils/helpers/crudHandler');
const User = require('@models/user');

module.exports = {
  userCRUD: generateResources(User, 'user')
};