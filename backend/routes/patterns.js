const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/patterns')

const patternController = require('../queries/patterns')

const router = express.Router()

// handle request to get all pattern
router.get('/patterns', async (req, res, next) => {
  try {
    res.send(await patternController.getAll())
  } catch (err) {
    next(err)
  }
})

// handle request to get a pattern
router.get(
  '/pattern',
  validate('query', schemas.get),
  async (req, res, next) => {
    try {
      res.send(await patternController.get(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to add new user
router.post(
  '/pattern',
  validate('body', schemas.new),
  async (req, res, next) => {
    try {
      res.send(await patternController.new(req.body))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to edit pattern
router.put(
  '/pattern',
  validate('body', schemas.edit),
  async (req, res, next) => {
    try {
      await patternController.edit(req.body)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

// handle request to delete an admin from the db
router.delete(
  '/pattern',
  validate('query', schemas.delete),
  async (req, res, next) => {
    try {
      await patternController.delete(req.query)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
