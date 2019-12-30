const Errors = require('../utils/errors')

const validate = (origin, schema) => {
  return async (req, res, next) => {
    try {
      console.log(req[origin])
      const result = await schema.validate(req[origin], {
        abortEarly: false,
        convert: true
      })
      if (result.error) {
        throw new Error(result.error)
      }
      next()
    } catch (err) {
      console.log(err)
      next(new Errors.BadRequest(err.message))
    }
  }
}

module.exports = {
  validate
}
