const { checkEmail } = require('@controllers/user/auth/checkEmail')
const { getByEmail } = require('@controllers/user/getByEmail')
const { login } = require('@controllers/user/auth/login')
const { generateResources } = require('@utils/helpers/crudHandler');
const User = require('@models/user');


module.exports = {
  userCRUD: generateResources(User, 'user',
      { create: true, read: true, update: true, delete: true }),
  login,
  checkEmail,
  getByEmail
}
