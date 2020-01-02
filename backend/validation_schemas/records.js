const Joi = require('@hapi/joi')
const global = require('./global')

const catches = Joi.number()
  .min(0)
  .integer()
  .required()

// eslint-disable-next-line no-useless-escape
const duration = Joi.string().regex(/^([0-9]{2})\:([0-9]{2})$/)

const video = Joi.string()
  .uri()
  .required()

module.exports = {
  get: Joi.object()
    .keys({
      uid: global.uid
    })
    .required(),

  getPBs: Joi.object()
    .keys({
      limit: Joi.number()
        .min(1)
        .integer()
        .required()
    })
    .required(),

  new: Joi.object()
    .keys({
      userUID: global.uid,
      patternUID: global.uid,
      catches,
      duration,
      video
    })
    .required(),

  edit: Joi.object()
    .keys({
      uid: global.uid,
      patternUID: global.uid,
      catches,
      duration,
      video
    })
    .required(),

  delete: Joi.object()
    .keys({
      uid: global.uid
    })
    .required()
}
