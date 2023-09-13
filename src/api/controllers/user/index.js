const { checkEmail } = require('@controllers/user/auth/checkEmail')
const { login } = require('@controllers/user/auth/login')
const { userCRUD } = require('@controllers/user/userCRUD')

module.exports = {
  userCRUD,
  login,
  checkEmail
}
