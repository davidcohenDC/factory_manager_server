const Joi = require("joi");
const {createValidationMiddleware} = require("@validations/common");

const logSource = 'MachineSensor Validation';

const machineSensorIdSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim()
});

const validateMachineSensorId = createValidationMiddleware(machineSensorIdSchema, 'params', logSource);

module.exports = {
    validateMachineSensorId
}