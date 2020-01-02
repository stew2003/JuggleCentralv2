const Joi = require('@hapi/joi')

module.exports = {
  users: Joi.object()
    .keys({
      query: Joi.string()
        .trim()
        .required(),
      orderBy: Joi.string()
        .valid('RELEVANCE', 'RANK')
        .failover('RELEVANCE')
        .required(),
      limit: Joi.number()
        .integer()
        .min(1)
        .default(null)
    })
    .required(),

  patterns: Joi.object()
    .keys({
      query: Joi.string()
        .trim()
        .required(),
      orderBy: Joi.string()
        .valid('RELEVANCE', 'DIFFICULTY', 'NUM_OBJECTS', 'POPULARITY')
        .failover('RELEVANCE')
        .required(),
      numObjects: Joi.number()
        .integer()
        .min(1)
        .when('orderBy', { is: 'NUM_OBJECTS', then: Joi.required() }),
      limit: Joi.number()
        .integer()
        .min(1)
        .default(null)
    })
    .required()
}
