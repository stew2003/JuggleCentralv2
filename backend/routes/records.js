const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/records')

const recordsController = require('../queries/records')

const router = express.Router()

// handle request to get all records
router.get('/records', async (req, res, next) => {
  try {
    res.send(await recordsController.getAll())
  } catch (err) {
    next(err)
  }
})

// handle request to get one of the records
router.get(
  '/record',
  validate('query', schemas.get),
  async (req, res, next) => {
    try {
      res.send(await recordsController.get(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get records associated with a user
router.get(
  '/records/user',
  validate('query', schemas.get),
  async (req, res, next) => {
    try {
      res.send(await recordsController.getByUser(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get records associated with a pattern
router.get(
  '/records/pattern',
  validate('query', schemas.get),
  async (req, res, next) => {
    try {
      res.send(await recordsController.getByPattern(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to get recent personal bests
router.get(
  '/records/pbs',
  validate('query', schemas.getPBs),
  async (req, res, next) => {
    try {
      res.send(await recordsController.getRecentPersonalBests(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to create a new record
router.post(
  '/record',
  validate('body', schemas.new),
  async (req, res, next) => {
    try {
      res.send(await recordsController.new(req.body))
    } catch (err) {
      next(err)
    }
  }
)

// handle request to edit a record
router.put(
  '/record',
  validate('body', schemas.edit),
  async (req, res, next) => {
    try {
      await recordsController.edit(req.body)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

// handle request to delete a record
router.delete(
  '/record',
  validate('query', schemas.delete),
  async (req, res, next) => {
    try {
      await recordsController.delete(req.query)
      res.send()
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
