const Joi = require('joi');
const { validateDecimal128String, createValidationMiddleware } = require('@validations/common');
const logSource = 'Machine Validation';

const machineIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
});

const rangeSchema = Joi.object({
  min: Joi.string().custom(validateDecimal128String).required(),
  max: Joi.string().custom(validateDecimal128String).required()
}).required();

const machineBodySchema = Joi.object({
  serial: Joi.string().trim().required(),
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
        measurementUnit: Joi.string().trim(),
        normalRange: rangeSchema
    }),
    emissions: Joi.object({
        measurementUnit: Joi.string().trim(),
      normalRange: rangeSchema
    }),
    operatingTemperature: Joi.object({
        measurementUnit: Joi.string().trim(),
      normalRange: rangeSchema
    }),
    vibration: Joi.object({
        measurementUnit: Joi.string().trim(),
      normalRange: rangeSchema
    }),
    pressure: Joi.object({
        measurementUnit: Joi.string().trim(),
      normalRange: rangeSchema
    })
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
});

const validateMachineBody = createValidationMiddleware(machineBodySchema, 'body', logSource);
const validateMachineId = createValidationMiddleware(machineIdSchema, 'params', logSource);

module.exports = {
  validateMachineBody,
  validateMachineId
};
