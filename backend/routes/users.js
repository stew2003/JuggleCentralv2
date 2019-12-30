const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/users')

const usersController = require('../queries/users')

const router = express.Router()

// handle request to add new user
router.post(
  '/user',
  validate('body', schemas.newUser),
  async (req, res, next) => {
    try {
      const newUser = await usersController.new(req.body)
      res.send(newUser)
    } catch (err) {
      next(err)
    }
  }
)

// handle request to edit user
router.put(
  '/user',
  validate('body', schemas.editUser),
  async (req, res, next) => {
    try {
      await usersController.edit(req.body)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

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
  validate('query', schemas.deleteUser),
  async (req, res, next) => {
    try {
      await usersController.delete(req.query)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get all users
router.get('/users', async (req, res, next) => {
  try {
    const users = await usersController.getAll()
    res.send(users)
  } catch (err) {
    next(err)
  }
})

module.exports = router
