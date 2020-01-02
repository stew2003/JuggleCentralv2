const Joi = require('@hapi/joi')
const global = require('./global')

const catches = Joi.number()
  .min(0)
  .integer()

// eslint-disable-next-line no-useless-escape
const duration = Joi.string().regex(/^([0-9]{2})\:([0-9]{2})\:([0-9]{2})$/)

const video = Joi.string()
  .uri()
  .allow('')
  .required()

module.exports = {
  get: Joi.object()
    .keys({
      uid: global.uid
    })
    .required(),

  getPBs: Joi.object()
    .keys({
      limit: global.limit,
      offset: global.offset
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
    .xor('catches', 'duration')
    .required(),

  edit: Joi.object()
    .keys({
      uid: global.uid,
      patternUID: global.uid,
      catches,
      duration,
      video
    })
    .nand('catches', 'duration')
    .required(),

  delete: Joi.object()
    .keys({
      uid: global.uid
    })
    .required()
}
