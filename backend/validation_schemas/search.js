const Joi = require('@hapi/joi')
const global = require('./global')

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
      limit: global.limit.default(null)
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
      limit: global.limit.default(null)
    })
    .required()
}
