const express = require('express')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/search')

const searchController = require('../queries/search')

const router = express.Router()

// get the user data for the search page
router.get(
  '/search/users',
  validate('query', schemas.users),
  async (req, res, next) => {
    try {
      res.send(await searchController.searchUsers(req.query))
    } catch (err) {
      next(err)
    }
  }
)

// get the pattern data for the search page
router.get(
  '/search/users',
  validate('query', schemas.patterns),
  async (req, res, next) => {
    try {
      res.send(await searchController.searchPatterns(req.query))
    } catch (err) {
      next(err)
    }
  }
)
