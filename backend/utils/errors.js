const HttpStatus = require('http-status-codes')

class ExtendableError extends Error {
  constructor(message, status) {
    // if someone tries to create just a plain ExtendableError
    if (new.target === ExtendableError) {
      throw new TypeError(
        'Abstract class "ExtendableError" cannot be instantiated directly.'
      )
    }
    super(message)
    this.name = this.constructor.name
    this.message = message
    this.status = status
    Error.captureStackTrace(this, this.contructor)
  }
}

// 400 Bad Request
class BadRequest extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('bad request', HttpStatus.BAD_REQUEST)
    } else {
      super(m, HttpStatus.BAD_REQUEST)
    }
  }
}

// 401 Unauthorized
class Unauthorized extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('unauthorized', HttpStatus.UNAUTHORIZED)
    } else {
      super(m, HttpStatus.UNAUTHORIZED)
    }
  }
}

// 403 Forbidden
class Forbidden extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('forbidden', HttpStatus.FORBIDDEN)
    } else {
      super(m, HttpStatus.FORBIDDEN)
    }
  }
}

// 404 Not Found
class NotFound extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('not found', HttpStatus.NOT_FOUND)
    } else {
      super(m, HttpStatus.NOT_FOUND)
    }
  }
}

// 409 Conflict
class Conflict extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('conflict', HttpStatus.CONFLICT)
    } else {
      super(m, HttpStatus.CONFLICT)
    }
  }
}

// 422 Unprocessable Entity
class UnprocessableEntity extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('unprocessable entity', HttpStatus.UNPROCESSABLE_ENTITY)
    } else {
      super(m, HttpStatus.UNPROCESSABLE_ENTITY)
    }
  }
}

// 500 Internal Server Error
class InternalServerError extends ExtendableError {
  constructor(m) {
    // if there is no message, just send a generic one
    if (arguments.length === 0) {
      super('internal server error', HttpStatus.INTERNAL_SERVER_ERROR)
    } else {
      super(m, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }
}

// export the errors
module.exports.BadRequest = BadRequest
module.exports.Unauthorized = Unauthorized
module.exports.Forbidden = Forbidden
module.exports.NotFound = NotFound
module.exports.Conflict = Conflict
module.exports.UnprocessableEntity = UnprocessableEntity
module.exports.InternalServerError = InternalServerError
