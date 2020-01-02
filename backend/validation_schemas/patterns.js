const Joi = require('@hapi/joi')
const global = require('./global')

module.exports = {
  get: Joi.object()
    .keys({
      uid: global.uid
    })
    .required(),

  getRecent: Joi.object().keys({
    limit: global.limit,
    offset: global.offset
  }),

  new: Joi.object()
    .keys({
      name: global.reqStr,
      description: global.reqStr,
      numObjects: Joi.number()
        .integer()
        .min(1)
        .required(),
      gif: Joi.string()
        .allow('')
        .uri()
        .required()
    })
    .required(),

  edit: Joi.object()
    .keys({
      uid: global.uid,
      name: global.reqStr,
      description: global.reqStr,
      numObjects: Joi.number()
        .integer()
        .min(1)
        .required(),
      gif: Joi.string()
        .uri()
        .required()
    })
    .required(),

  delete: Joi.object()
    .keys({
      uid: global.uid
    })
    .required()
}
