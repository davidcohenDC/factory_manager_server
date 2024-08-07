const Joi = require('joi');
const { createValidationMiddleware } = require('@validations/common');
const logSource = 'Area Validation';

const areaIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
});

const areaBodySchema = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().required()
});

const validateAreaBody = createValidationMiddleware(areaBodySchema, 'body', logSource);
const validateAreaId = createValidationMiddleware(areaIdSchema, 'params', logSource);

module.exports = {
  validateAreaBody,
  validateAreaId
}
