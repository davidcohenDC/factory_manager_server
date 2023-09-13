const { generateResources } = require('@utils/helpers/crudHandler')
const User = require('@models/user')
const { userBodySchema, userIdSchema } = require('@validations/user.validation')
const userCRUD = generateResources(User, 'user', userBodySchema, userIdSchema)

module.exports = {
  userCRUD
}
