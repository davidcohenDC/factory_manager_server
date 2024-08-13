const Joi = require('joi');
const { createValidationMiddleware } = require('@validations/common');
const logSource = 'AreaValidation';

const areaIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
});

const machineSchema = Joi.object({
  name: Joi.string().trim().required(),
  serial: Joi.string().trim().required(),
  location: Joi.object({
    area: Joi.string().trim().required()
  }).required(),
  machineState: Joi.object({
    currentState: Joi.string().valid('operational', 'stand-by', 'maintenance', 'anomaly', 'off').required(),
    anomalyDetails: Joi.array().items(Joi.string().trim()).allow(null)
  }).required(),
  specifications: Joi.object({
    powerConsumption: Joi.object({
      measurementUnit: Joi.string().trim(),
      normalRange: Joi.object({
        min: Joi.string().required(),
        max: Joi.string().required()
      }).required()
    }).required(),
    emissions: Joi.object({
      measurementUnit: Joi.string().trim(),
      normalRange: Joi.object({
        min: Joi.string().required(),
        max: Joi.string().required()
      }).required()
    }).required(),
    operatingTemperature: Joi.object({
      measurementUnit: Joi.string().trim(),
      normalRange: Joi.object({
        min: Joi.string().required(),
        max: Joi.string().required()
      }).required()
    }).required()
  }).required(),
  turns: Joi.array().items(
      Joi.object({
        turn: Joi.string().valid('morning', 'evening', 'night').required(),
        userId: Joi.string().length(24).hex().trim().required(),
      })
  ),
  test: Joi.boolean()
});

const areaBodySchema = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().required(),
  machines: Joi.array().items(machineSchema).required(),  // Include machines in validation
  subAreas: Joi.array().items(  // Include subAreas in validation
      Joi.object({
        name: Joi.string().trim().required(),
        size: Joi.number().required(),
        machines: Joi.array().items(machineSchema)
      })
  ),
  test: Joi.boolean()
});

const validateAreaBody = createValidationMiddleware(areaBodySchema, 'body', logSource);
const validateAreaId = createValidationMiddleware(areaIdSchema, 'params', logSource);

module.exports = {
  validateAreaBody,
  validateAreaId
}