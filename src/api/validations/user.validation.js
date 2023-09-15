const Joi = require('joi')
const { logger } = require('@config/')

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const phoneNumberSchema = Joi.object({
  type: Joi.string().valid('mobile').trim(),
  number: Joi.string().trim()
});

const emailSchema = Joi.string().email().required().trim();
const passwordSchema = Joi.string()
    .required()
    .trim()
    .pattern(passwordRegex)
    .message({
      'string.pattern.base': 'Password must contain at least 8 characters, one letter, one number, and one special character'
    });

const userBodySchema = Joi.object({
  name: Joi.object({
    first: Joi.string().trim().optional(),
    last: Joi.string().trim().optional()
  }),
  email: emailSchema,
  password: passwordSchema,
  dateOfBirth: Joi.date().optional(),
  address: Joi.object({
    street: Joi.string().trim().optional(),
    city: Joi.string().trim().optional(),
    state: Joi.string().trim().optional(),
    zip: Joi.string().trim().optional(),
    country: Joi.string().trim().optional()
  }),
  phoneNumbers: Joi.array().items(phoneNumberSchema),
  role: Joi.string().valid('administrator', 'moderator', 'worker').trim().optional(),
  department: Joi.string().trim().optional(),
  isActive: Joi.boolean().optional(),
  lastLogin: Joi.date().optional(),
  profilePicture: Joi.string().trim().optional(),
  security: Joi.object({
    twoFactorEnabled: Joi.boolean().optional(),
    lastPasswordChange: Joi.date().optional()
  }),
  preferences: Joi.object({
    theme: Joi.string().valid('light', 'dark').trim().optional(),
    language: Joi.string().valid('en', 'es', 'fr').trim().optional()
  }),
  socialLinks: Joi.object({
    linkedin: Joi.string().trim().optional(),
    twitter: Joi.string().trim().optional()
  }),
  joinedDate: Joi.date().optional(),
  notes: Joi.string().trim().optional(),
  testUser: Joi.boolean().optional()
})
const userIdSchema = Joi.object({
  id: Joi.string().required().trim()
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

const checkMailSchema = Joi.object({
  email: emailSchema
});

const validate = async (schema, source, req) => {
  await schema.validateAsync(req[source]);
};

const validateUserBody = async (req, res, next) => {
  try {
    await validate(userBodySchema, 'body', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error('Validation Error in body - User Validation Middleware', {
      message: errorMessage,
      req,
      source: 'validateUserBody'
    });
    res.status(400).json({ message: errorMessage });
  }
};

const validateUserId = async (req, res, next) => {
  try {
    await validate(userIdSchema, 'params', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error('Validation Error in params - User Validation Middleware', {
      message: errorMessage,
      req,
      source: 'validateUserId'
    });
    res.status(400).json({ message: errorMessage });
  }
};

const validateLogin = async (req, res, next) => {
  try {
    await validate(loginSchema, 'body', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error('Validation Error in body - User Validation Middleware', {
      message: errorMessage,
      req,
      source: 'validateLogin'
    });
    res.status(400).json({ message: errorMessage });
  }
};

const validateCheckMail = async (req, res, next) => {
  try {
    await validate(checkMailSchema, 'body', req);
    next();
  } catch (error) {
    const errorMessage = error.details[0].message;
    logger.error('Validation Error in body - User Validation Middleware', {
      message: errorMessage,
      req,
      source: 'validateCheckMail'
    });
    res.status(400).json({ message: errorMessage });
  }
};

module.exports = {
  validateUserBody,
  validateUserId,
  validateLogin,
  validateCheckMail
};