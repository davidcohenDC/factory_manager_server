const Joi = require('joi')
const { createValidationMiddleware } = require('@validations/common')
const logSource = 'AreaValidation'
const { machineBodySchema } = require('@validations/machine.validation')

const areaIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
})

// Define subAreaSchema separately
const subAreaSchema = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().required(),
  machines: Joi.array().items(machineBodySchema),
  subAreas: Joi.array().items(
    // Reference the same schema for nested sub-areas
    Joi.link('#subAreaSchema')
  ),
  test: Joi.boolean()
}).id('subAreaSchema') // Assign an ID to allow self-referencing

const areaBodySchema = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().required(),
  machines: Joi.array().items(machineBodySchema).required(),
  subAreas: Joi.array().items(subAreaSchema), // Use the subArea schema
  test: Joi.boolean()
})

const validateAreaBody = createValidationMiddleware(
  areaBodySchema,
  'body',
  logSource
)
const validateAreaId = createValidationMiddleware(
  areaIdSchema,
  'params',
  logSource
)

module.exports = {
  validateAreaBody,
  validateAreaId
}
