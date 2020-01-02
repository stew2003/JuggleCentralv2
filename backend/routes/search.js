const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/search')

const searchController = require('../queries/search')

const router = express.Router()

// TODO:
// get the data for the search page
router.get(
  '/search',
  validate('query', schemas.get),
  async (req, res, next) => {
    try {
      res.send('TODO')
    } catch (err) {
      next(err)
    }
  }
)
