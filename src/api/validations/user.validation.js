const Joi = require('joi')
const { logger } = require('@config/')

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

const validate = async (schema, source, req) => {
  await schema.validateAsync(req[source]);
};

module.exports.validateUserBody = async (req, res, next) => {
  try {
    await validate(userBodySchema, 'body', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error(`Validation Error in body - User Validation Middleware`, {
      message: errorMessage,
      req,
      source: 'validateUserBody'
    });
    res.status(400).json({ message: errorMessage });
  }
};

module.exports.validateUserId = async (req, res, next) => {
  try {
    await validate(userIdSchema, 'params', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error(`Validation Error in params - User Validation Middleware`, {
      message: errorMessage,
      req,
      source: 'validateUserId'
    });
    res.status(400).json({ message: errorMessage });
  }
};

module.exports.validateLogin = async (req, res, next) => {
  try {
    await validate(loginSchema, 'body', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error(`Validation Error in body - User Validation Middleware`, {
      message: errorMessage,
      req,
      source: 'validateLogin'
    });
    res.status(400).json({ message: errorMessage });
  }
};

module.exports.validateCheckMail = async (req, res, next) => {
  try {
    await validate(checkMailSchema, 'body', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error(`Validation Error in body - User Validation Middleware`, {
      message: errorMessage,
      req,
      source: 'validateCheckMail'
    });
    res.status(400).json({ message: errorMessage });
  }
};

// export also the schemas
module.exports.emailValidationStructure = emailValidationStructure
module.exports.passwordValidationStructure = passwordValidationStructure
module.exports.userBodySchema = userBodySchema
module.exports.userIdSchema = userIdSchema
