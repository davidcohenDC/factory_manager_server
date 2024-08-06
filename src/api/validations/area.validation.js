const Joi = require('joi');
const { logger } = require('@config/');
const { Decimal128 } = require('mongoose').Types;

const logSource = 'Area Validation';

const areaIdSchema = Joi.object({
  id: Joi.string().length(24).hex().required().trim()
});

const areaBodySchema = Joi.object({
  name: Joi.string().trim().required(),
  size: Joi.number().required()
});

const validate = async (schema, source, req) => {
  await schema.validateAsync(req[source]);
}

const validateAreaBody = async (req, res, next) => {
  try {
    await validate(areaBodySchema, 'body', req);
    next();
  } catch (error) {
    logger.error(`${logSource}: ${error.message}`);
    res.status(400).send({ error: error.message });
  }
}

const validateAreaId = async (req, res, next) => {
  try {
    await validate(areaIdSchema, 'params', req);
    next();
  } catch (error) {
    logger.error(`${logSource}: ${error.message}`);
    res.status(400).send({ error: error.message });
  }
}

module.exports = {
  validateAreaBody,
  validateAreaId
}
