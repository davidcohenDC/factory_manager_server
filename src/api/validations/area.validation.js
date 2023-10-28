const Joi = require('joi');
const {logger} = require("@root/config");
const { Decimal128 } = require('mongoose').Types;

const logSource = 'Area Validation'

const areaIdSchema = Joi.object({
    id: Joi.string().length(24).hex().required().trim()
})

const validateDecimal128 = (value, helpers) => {
    if (!(value instanceof Decimal128)) {
        return helpers.error('any.invalid', { message: 'Value must be an instance of Decimal128' });
    }
    return value;
};

const validate = async (schema, source, req) => {
    await schema.validateAsync(req[source])
}

const areaBodySchema = Joi.object({
    name: Joi.string().trim().required(),
    size: Joi.number().required()
})

const validateAreaBody = async (req, res, next) => {
    try {
        await validate(areaBodySchema, 'body', req)
        next()
    } catch (error) {
        logger.error(`${logSource}: ${error.message}`)
        res.status(400).send({ error: error.message })
    }
}

const validateAreaId = async (req, res, next) => {
    try {
        await validate(areaIdSchema, 'params', req)
        next()
    } catch (error) {
        logger.error(`${logSource}: ${error.message}`)
        res.status(400).send({ error: error.message })
    }
}

module.exports = {
    validateAreaBody,
    validateAreaId
}