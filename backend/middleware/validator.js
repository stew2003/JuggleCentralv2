const Errors = require('../utils/errors')

const validate = (origin, schema) => {
  return async (req, res, next) => {
    try {
      console.log(req[origin])
      req[origin] = await schema.validateAsync(req[origin], {
        abortEarly: false,
        convert: true
      })
      console.log(req[origin])
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
