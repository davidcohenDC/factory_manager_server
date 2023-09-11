const { login } = require('./auth/login');
const { checkEmail } = require('./auth/checkEmail');
const { CRUDHandler, generateSwaggerDocForCRUD } = require('../../../utils/helpers/crudHandler');
const User = require('../../../models/user');

const userHandler = CRUDHandler(User, 'user');
const userCRUDSpecs = generateSwaggerDocForCRUD('User', 'UserSchema');

module.exports = {
    userHandler,
    userCRUDSpecs,
    login,
    checkEmail
}