const Joi = require('joi');

const authValidationJoi = Joi.object().keys({
  email: Joi.string().required(),
  password: Joi.string().optional(),
});

module.exports = { authValidationJoi };