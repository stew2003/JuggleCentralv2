const fetch = require('node-fetch')
const usersController = require('../queries/users')
const sys = require('../utils/settings')
const Errors = require('../utils/errors')

// verify the authentication token sent in the header
module.exports = async (req, res, next) => {
  console.log('Trying to authenticate')
  let token
  try {
    console.log(req.headers)

    // isolate the token
    token = req.headers.authorization.replace('Bearer ', '')

    // try and find an admin who has logged in with this token before
    if (await usersController.getByToken(token)) {
      next()
      return
    }

    // authenticate the token
    const url = `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`
    const userInfo = await fetch(url)
    const userJson = await userInfo.json()

    // check if the email is in the system
    const { exists, uid } = await usersController.getByEmail(userJson.email)

    // if the user with that email exist
    if (exists) {
      // update that admin's token to this one
      await usersController.setToken(uid, token)
      next()
      return
    }

    // if the user's email does not match the restriction
    if (
      sys.EMAIL_DOMAIN_RESTRICTION &&
      !sys.EMAIL_DOMAIN_RESTRICTION.test(userJson.email)
    ) {
      throw new Error(
        'You are not in the juggling database and you are not connected to the affiliated association'
      )
    }

    // create a new user
    console.log(userJson)

    next()
    return
  } catch (err) {
    next(new Errors.InternalServerError(err.message))
  }
}
