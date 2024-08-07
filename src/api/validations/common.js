const { Decimal128 } = require('mongoose').Types;
const { logger } = require('@config/');

const validateDecimal128String = (value, helpers) => {
    try {
        Decimal128.fromString(value);
        return value;
    } catch (err) {
        return helpers.error('any.invalid', {
            message: 'Value must be a valid Decimal128 string'
        });
    }
};

const validateSchema = async (schema, source, req) => {
    await schema.validateAsync(req[source]);
};

const createValidationMiddleware = (schema, source = 'body', classSource) => async (req, res, next) => {
    try {
        await validateSchema(schema, source, req);
        next();
    } catch (error) {
        const errorMessage = error.details[0].message;
        logger.error(`Validation Error in ${source}`, {
            error: errorMessage,
            req,
            source: classSource
        });
        res.status(400).json({ error: errorMessage });
    }
};

module.exports = {
    validateDecimal128String,
    createValidationMiddleware,
};
