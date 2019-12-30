const Joi = require('@hapi/joi')

const idSchema = Joi.number()
  .integer()
  .min(1)
  .required()

module.exports = {
  idSchema
}
