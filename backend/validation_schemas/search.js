const Joi = require('@hapi/joi')
const global = require('./global')

module.exports = {
  // TODO:
  get: Joi.object()
    .keys({})
    .required()
}
