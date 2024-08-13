const Joi = require("joi");
const { createValidationMiddleware, validateDecimal128String } = require("@validations/common");

const logSource = 'MachineSensor Validation';

// Define the schema for a single sensor data entry
const sensorDataEntrySchema = Joi.object({
    timestamp: Joi.date().default(Date.now).required(),
    powerConsumption: Joi.custom(validateDecimal128String),
    emissions: Joi.custom(validateDecimal128String),
    operatingTemperature: Joi.custom(validateDecimal128String),
    vibration: Joi.custom(validateDecimal128String),
    pressure: Joi.custom(validateDecimal128String),
    anomaly: Joi.boolean().default(false)
});

// Define the main validation schema for MachineSensor
const machineSensorBodySchema = Joi.object({
    serial: Joi.string().trim().required(),
    sensorData: Joi.array().items(sensorDataEntrySchema),  // Validate the array of sensor data entries
    test: Joi.boolean()
});

const machineSensorIdSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim()
});

const validateMachineSensorBody = createValidationMiddleware(machineSensorBodySchema, 'body', logSource);
const validateMachineSensorId = createValidationMiddleware(machineSensorIdSchema, 'params', logSource);

module.exports = {
    validateMachineSensorId,
    validateMachineSensorBody
};
