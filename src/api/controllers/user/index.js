const { checkEmail } = require('@controllers/user/auth/checkEmail')
const { getByEmail } = require('@controllers/user/getByEmail')
const { login } = require('@controllers/user/auth/login')
const { userCRUD } = require('@controllers/user/userCRUD')

module.exports = {
  userCRUD,
  login,
  checkEmail,
  getByEmail
}
