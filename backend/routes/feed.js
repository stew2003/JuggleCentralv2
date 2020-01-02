const express = require('express')
const moment = require('moment')

const { validate } = require('../middleware/validator')
const schemas = require('../validation_schemas/feed')

const patternsController = require('../queries/patterns')
const usersController = require('../queries/users')
const recordsController = require('../queries/records')

const router = express.Router()

// handle request to get n of the latest items from the home feed
router.get('/feed', validate('query', schemas.feed), async (req, res, next) => {
  try {
    // get recent updates from users, patterns, and records
    const users = await usersController.getRecentCreations(req.query.limit)
    const patterns = await patternsController.getRecentCreations(
      req.query.limit
    )
    const PBs = await recordsController.getRecentPersonalBests(req.query.limit)

    // put them all together, one big family
    const all = [...users, ...patterns, ...PBs]

    for (let i = 0; i < all.length; i++) {
      const a = all[i]
      // parse time created into moment object for comparison
      a.timeCreated = moment(a.timeCreated)

      // get relative time as string (ie 30 min ago)
      a.relativeTime = a.timeCreated.fromNow()
    }

    if (all.length > 0) {
      // sort by date of occurrence (most recent to front)
      all.sort((a, b) => {
        return b.timeCreated.isBefore(a.timeCreated) ? -1 : 1
      })
    }

    // take the first N elements of the feed overall
    res.send(all.slice(0, req.query.limit))
  } catch (err) {
    next(err)
  }
})

module.exports = router
