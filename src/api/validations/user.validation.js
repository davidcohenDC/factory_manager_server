const Joi = require('joi');
const { createValidationMiddleware } = require('@validations/common');
const logSource = 'User Validation';

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

const phoneNumberSchema = Joi.object({
  type: Joi.string().valid('mobile').trim(),
  number: Joi.string().trim()
});

const emailSchema = Joi.string().required().trim().email().message({
  'string.pattern.base': '"email" must be a valid email'
});

const passwordSchema = Joi.string()
    .required()
    .trim()
    .pattern(passwordRegex)
    .message({
      'string.pattern.base': '"password" must contain at least 8 characters, one letter, one number, and one special character'
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
  role: Joi.string()
      .valid('administrator', 'moderator', 'worker')
      .trim()
      .optional(),
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
    language: Joi.string().valid('en', 'es', 'fr', 'it').trim().optional()
  }),
  accessibility: Joi.object({
    colorFilter: Joi.string().trim().optional(),
  }),
  socialLinks: Joi.object({
    linkedin: Joi.string().trim().optional(),
    twitter: Joi.string().trim().optional()
  }),
  joinedDate: Joi.date().optional(),
  notes: Joi.string().trim().optional(),
  test: Joi.boolean().optional()
});

const userIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
});

const loginSchema = Joi.object({
  email: emailSchema,
  password: passwordSchema
});

const checkMailSchema = Joi.object({
  email: emailSchema
});


const validateUserBody = createValidationMiddleware(userBodySchema, 'body', logSource);
const validateUserId = createValidationMiddleware(userIdSchema, 'params', logSource);
const validateLogin = createValidationMiddleware(loginSchema, 'body', logSource);
const validateCheckMail = createValidationMiddleware(checkMailSchema, 'body', logSource);

module.exports = {
  validateUserBody,
  validateUserId,
  validateLogin,
  validateCheckMail
};
