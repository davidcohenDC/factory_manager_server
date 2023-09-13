const Joi = require('joi')

//use comprehensive8 regex
const passwordRegex =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/

// Structures of validation

const emailValidationStructure = {
  email: Joi.string().email().required().lowercase()
}

const passwordValidationStructure = {
  password: Joi.string()
    .required()
    .pattern(passwordRegex)
    .message({
      'string.pattern.base':
        'Password must contain at least 8 characters, one letter, one number and one special character'
    })
}

// Questo è solo un esempio; il tuo schema potrebbe avere campi diversi
const userBodySchema = Joi.object({
  //base structure for the user creation body request
  ...emailValidationStructure,
  ...passwordValidationStructure
}).unknown()

const userIdSchema = Joi.object({
  id: Joi.string().required()
})

const loginSchema = Joi.object({
  ...emailValidationStructure,
  ...passwordValidationStructure
})

const checkMailSchema = Joi.object({
  ...emailValidationStructure
})

module.exports.validateUserBody = async (req, res, next) => {
  //create base schema for creation of the user
  try {
    await userBodySchema.validateAsync(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: error.details[0].message })
  }
}

module.exports.validateUserId = async (req, res, next) => {
  try {
    await userIdSchema.validateAsync(req.params)
    next()
  } catch (error) {
    res.status(400).json({ message: error.details[0].message })
  }
}

module.exports.validateLogin = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: error.details[0].message })
  }
}

module.exports.validateCheckMail = async (req, res, next) => {
  try {
    await checkMailSchema.validateAsync(req.body)
    next()
  } catch (error) {
    res.status(400).json({ message: error.details[0].message })
  }
}

// export also the schemas
module.exports.emailValidationStructure = emailValidationStructure
module.exports.passwordValidationStructure = passwordValidationStructure
module.exports.userBodySchema = userBodySchema
module.exports.userIdSchema = userIdSchema
