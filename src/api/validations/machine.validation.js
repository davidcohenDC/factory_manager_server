const Joi = require('joi')
const { logger } = require('@root/config')
const { Decimal128 } = require('mongoose').Types

const logSource = 'Machine Validation'

const validateDecimal128String = (value, helpers) => {
  try {
    Decimal128.fromString(value)
    return value
  } catch (err) {
    return helpers.error('any.invalid', {
      message: 'Value must be a valid Decimal128 string'
    })
  }
}

const validate = async (schema, source, req) => {
  await schema.validateAsync(req[source])
}

const machineIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
})

const rangeSchema = Joi.object({
  min: Joi.string().custom(validateDecimal128String).required(),
  max: Joi.string().custom(validateDecimal128String).required()
}).required()

const machineBodySchema = Joi.object({
  machineId: Joi.string().trim().required(),
  name: Joi.string().trim().required(),
  location: Joi.object({
    area: Joi.string().trim().required()
  }).required(),
  machineState: Joi.object({
    currentState: Joi.string().valid('operational', 'stand-by', 'maintenance', 'anomaly', 'off').required(),
    anomalyDetails: Joi.array().items(Joi.string().trim())
  }),
  specifications: Joi.object({
    powerConsumption: Joi.object({
      normalRange: rangeSchema
    }),
    emissions: Joi.object({
      normalRange: rangeSchema
    }),
    operatingTemperature: Joi.object({
      normalRange: rangeSchema
    }),
    humidity: Joi.object({
      normalRange: rangeSchema
    }),
  }).required(),
  turns: Joi.array().items(
      Joi.object({
        turn: Joi.string().valid('morning', 'evening', 'night').required(),
        userId: Joi.string().length(24).hex().trim(),
        name: Joi.object({
            firstName: Joi.string().trim(),
            lastName: Joi.string().trim()
        })
      })
  ),
  maintenance: Joi.object({
    lastMaintenanceDate: Joi.date(),
    nextMaintenanceDate: Joi.date(),
    maintenanceHistory: Joi.array().items(
        Joi.object({
          date: Joi.date(),
          description: Joi.string().trim()
        })
    )
  }),
  log: Joi.object({
    lastPowerOn: Joi.date(),
    lastPowerOff: Joi.date(),
    sessions: Joi.array().items(
        Joi.object({
          powerOn: Joi.date(),
          powerOff: Joi.date(),
          duration: Joi.string().trim()
        })
    )
  }),
  test: Joi.boolean()
})

const validateMachineBody = async (req, res, next) => {
  try {
    await machineBodySchema.validateAsync(req.body)
    next()
  } catch (error) {
    const detailedMessage = `Validation error: ${
        error.details[0].message
    }. Path: ${error.details[0].path.join('.')}. Type: ${error.details[0].type}`
    logger.error('Validation Error in body', {
      error: detailedMessage,
      req, // log only the request body
      source: logSource
    })

    res.status(400).json({ error: detailedMessage })
  }
}

const validateMachineId = async (req, res, next) => {
  try {
    await validate(machineIdSchema, 'params', req)
    next()
  } catch (error) {
    const errorMessage = error.details[0].message
    logger.error('Validation Error in params', {
      error: errorMessage,
      req,
      source: logSource
    })
    res.status(400).json({ error: errorMessage })
  }
}

module.exports = {
  validateMachineBody,
  validateMachineId
}
