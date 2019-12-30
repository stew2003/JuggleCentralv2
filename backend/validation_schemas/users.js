const Joi = require('@hapi/joi')
const global = require('./global')

const reqStr = Joi.string().required()

const email = Joi.string()
  .email()
  .required()

const isAdmin = Joi.number()
  .integer()
  .min(0)
  .max(1)
  .required()

const newUser = Joi.object()
  .keys({
    name: reqStr,
    email,
    isAdmin
  })
  .required()

const editUser = Joi.object()
  .keys({
    uid: global.idSchema,
    name: reqStr,
    bio: reqStr
  })
  .required()

const setAdmin = Joi.object()
  .keys({
    uid: global.idSchema,
    isAdmin
  })
  .required()

const deleteUser = Joi.object()
  .keys({
    uid: global.idSchema
  })
  .required()

module.exports = {
  newUser,
  editUser,
  setAdmin,
  deleteUser
}
