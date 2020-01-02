const Joi = require('@hapi/joi')
const global = require('./global')

const email = Joi.string()
  .email()
  .required()

module.exports = {
  get: Joi.object()
    .keys({
      uid: global.uid
    })
    .required(),

  limit: Joi.object()
    .keys({
      limit: Joi.number()
        .integer()
        .min(1)
        .required()
    })
    .required(),

  new: Joi.object()
    .keys({
      name: global.reqStr,
      email,
      isAdmin: global.boolean
    })
    .required(),

  edit: Joi.object()
    .keys({
      uid: global.uid,
      name: global.reqStr,
      bio: global.reqStr
    })
    .required(),

  setAdmin: Joi.object()
    .keys({
      uid: global.uid,
      isAdmin: global.boolean
    })
    .required(),

  delete: Joi.object()
    .keys({
      uid: global.uid
    })
    .required()
}
