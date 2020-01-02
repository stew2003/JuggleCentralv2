const Joi = require('@hapi/joi')

module.exports = {
  feed: Joi.object()
    .keys({
      limit: Joi.number()
        .integer()
        .min(1)
        .required()
    })
    .required()
}
