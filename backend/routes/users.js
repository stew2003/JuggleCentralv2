const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/users')

const usersController = require('../queries/users')

const router = express.Router()

// handle request to get all users
router.get('/users', async (req, res, next) => {
  try {
    res.send(await usersController.getAll())
  } catch (err) {
    next(err)
  }
})

// handle request to get one user
router.get('/user', validate('query', schemas.get), async (req, res, next) => {
  try {
    res.send(await usersController.get(req.query))
  } catch (err) {
    next(err)
  }
})

// handle request to get recently created users
router.get(
  '/users/recent',
  validate('query', schemas.getRecent),
  async (req, res, next) => {
    try {
      res.send(await usersController.getRecentCreations(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get ther user leaderboards
router.get('/users/leaderboard', async (req, res, next) => {
  try {
    res.send(await usersController.getLeaderboard())
  } catch (err) {
    next(err)
  }
})

// handle request to add new user
router.post('/user', validate('body', schemas.new), async (req, res, next) => {
  try {
    res.send(await usersController.new(req.body))
  } catch (err) {
    next(err)
  }
})

// handle request to edit user
router.put('/user', validate('body', schemas.edit), async (req, res, next) => {
  try {
    await usersController.edit(req.body)
    res.send()
  } catch (err) {
    next(err)
  }
})

// handle request to edit the admin status of a user
router.put(
  '/user/admin',
  validate('body', schemas.setAdmin),
  async (req, res, next) => {
    try {
      await usersController.adminStatus(req.body)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

// handle request to delete an admin from the db
router.delete(
  '/user',
  validate('query', schemas.delete),
  async (req, res, next) => {
    try {
      await usersController.delete(req.query)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
