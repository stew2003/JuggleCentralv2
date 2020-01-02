const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/patterns')

const patternsController = require('../queries/patterns')

const router = express.Router()

// handle request to get all patterns
router.get('/patterns', async (req, res, next) => {
  try {
    res.send(await patternsController.getAll())
  } catch (err) {
    next(err)
  }
})

// handle request to get a pattern by uid
router.get(
  '/pattern',
  validate('query', schemas.get),
  async (req, res, next) => {
    try {
      res.send(await patternsController.get(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get recently created patterns
router.get(
  '/patterns/recent',
  validate('query', schemas.getRecent),
  async (req, res, next) => {
    try {
      res.send(await patternsController.getRecentCreations(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get all possible number of objects
router.get('/patterns/objects', async (req, res, next) => {
  try {
    res.send(await patternsController.getPossibleNumObjects())
  } catch (err) {
    next(err)
  }
})

// handle request to add new user
router.post(
  '/pattern',
  validate('body', schemas.new),
  async (req, res, next) => {
    try {
      res.send(await patternsController.new(req.body))
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
      await patternsController.edit(req.body)
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
      await patternsController.delete(req.query)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
