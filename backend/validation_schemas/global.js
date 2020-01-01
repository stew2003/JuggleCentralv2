const Joi = require('@hapi/joi')

module.exports = {
  uid: Joi.number()
    .integer()
    .min(1)
    .required(),

  reqStr: Joi.string()
    .min(1)
    .trim()
    .required(),

  boolean: Joi.number()
    .integer()
    .min(0)
    .max(1)
    .required()
}
