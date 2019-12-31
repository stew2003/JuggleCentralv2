const pool = require('./connection')
const userController = require('./users')
const recordsController = require('./records')
const Errors = require('../utils/errors')

module.exports = {
  // get all of the patterns
  getAll: async (uid = false) => {
    try {
      const patterns = await pool.query('SELECT * FROM patterns;')
      if (uid) {
        return patterns.map((pattern) => pattern.uid)
      }
      return patterns
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get which patterns are associated with userUIDs
  getByUsers: async (userUIDs) => {
    try {
      // no patterns are affected by no users
      if (!(userUIDs && userUIDs.length > 0)) {
        return []
      }

      const records = await pool.query(
        `SELECT patternUID FROM records WHERE userUID IN (?) GROUP BY patternUID;`,
        [userUIDs]
      )
      // return an array of pattern uids
      return records.map((r) => r.patternUID)
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },
  /*	Recalculate and store the average personal best for time and catches for a given subset of patterns.
    If no subset given, will update average PB scores for all patterns. */
  updateAvgHighScores: async (patternUIDs) => {
    try {
      if (!(patternUIDs && patternUIDs.length > 0)) {
        throw new Error('Cannot get high scores with no patterns given')
      }

      // reset all affected pattern averages to 0, so that even patterns which have no records are still updated
      await pool.query(
        `UPDATE patterns SET avgHighScoreCatch = 0, avgHighScoreTime = 0 WHERE uid IN (?);`,
        [patternUIDs]
      )

      const records = await pool.query(
        'SELECT records.*, TIME_TO_SEC(duration) AS seconds FROM records WHERE isPersonalBest = 1 AND patternUID IN (?) ORDER BY patternUID;',
        [patternUIDs]
      )

      // if all records were wiped then the patterns are good at 0
      if (records.length === 0) {
        return
      }

      const catches = []
      let catchQuery = ''
      const times = []
      let timeQuery = ''

      // for each personal best
      for (let i = 0; i < records.length; i++) {
        let j = i

        // variables for computing average score at each pattern
        let numCatchRecords = 0
        let catchSum = 0
        let numTimeRecords = 0
        let timeSum = 0

        // get pattern UID of the record we're looking at
        const currentPatternUID = records[i].patternUID

        // while looking at records under this pattern
        while (
          j < records.length &&
          records[j].patternUID === currentPatternUID
        ) {
          // if record is catch-based
          if (records[j].catches) {
            // add to sum, increment number of catch-based records
            catchSum += records[j].catches
            numCatchRecords++

            // if record time-based
          } else if (records[j].seconds) {
            // add to sum, increment number of time-based records
            timeSum += records[j].seconds
            numTimeRecords++
          }

          // move to next record
          j++
        }

        // move i to where we left off with j
        i = j

        // update catch average for this pattern, add to update params
        catches.push(
          currentPatternUID,
          numCatchRecords > 0 ? catchSum / numCatchRecords : 0
        )
        catchQuery += ' WHEN uid = ? THEN ?'

        // update time average for this pattern, add to update params
        times.push(
          currentPatternUID,
          numTimeRecords > 0 ? timeSum / numTimeRecords : 0
        )
        timeQuery += ' WHEN uid = ? THEN ?'
      }

      // add all update parameters to one array
      const updates = catches.concat(times)

      await pool.query(
        `UPDATE patterns SET avgHighScoreCatch = CASE${catchQuery} ELSE avgHighScoreCatch END, avgHighScoreTime = CASE${timeQuery} ELSE avgHighScoreTime END;`,
        updates
      )

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get the current max average high score values for both time and catches across all patterns
  getMaxAvgHighScores: async () => {
    try {
      const maxes = await pool.query(
        'SELECT MAX(avgHighScoreCatch) AS maxAvgCatch, MAX(avgHighScoreTime) AS maxAvgTime FROM patterns;'
      )

      if (maxes.length < 1) {
        throw new Error(
          'There are no patterns from which to retrieve max scores'
        )
      }

      return maxes[0]
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*	Determine the relative frequencies of each scoring method (catch- and time-based) for a given subset of patterns
		Calls back on a mapping from pattern UID to an object of the form { timeWeight: <float>, catchWeight: <float> }
		representing the weights for that pattern.
		If a pattern UID maps to null, assume to use weights of 0 for that pattern. */
  getScoringWeights: async (patternUIDs) => {
    try {
      if (!(patternUIDs && patternUIDs.length > 0)) {
        throw new Error('Cannot get scoring weights with no patterns given')
      }

      const records = await pool.query(
        'SELECT patternUID, catches IS NULL AS isTimeRecord, COUNT(*) AS count FROM records WHERE patternUID IN (?) GROUP BY patternUID, isTimeRecord;',
        [patternUIDs]
      )

      // if there are no records return and empty object
      if (records.length === 0) {
        return {}
      }

      const uidToWeights = {}

      // look at records in groups of two
      for (let i = 0; i < records.length - 1; i += 2) {
        // get total number of PB records
        const total = records[i].count + records[i + 1].count

        // get counts for catch- and time-based PB records in this pattern
        const c = records[i].isTimeRecord === 1 ? records[i + 1] : records[i]
        const t = records[i].isTimeRecord === 1 ? records[i] : records[i + 1]

        // update weights to reflect frequency of scoring methods
        uidToWeights[records[i].patternUID] = {
          catchWeight: c.count / total,
          timeWeight: t.count / total
        }
      }

      return uidToWeights
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*	Calculate the difficulties of a subset of patterns, assuming the
		number of objects and average high scores have been updated already.
		If no subset given, calculate for all patterns.
    ASSUMES stored average high scores are up to date. */
  calcDifficulties: async (patternUIDs) => {
    try {
      if (!(patternUIDs && patternUIDs.length > 0)) {
        throw new Error(
          'Cannot get pattern difficulties with no patterns given'
        )
      }

      const patterns = await pool.query(
        'SELECT uid, numObjects, avgHighScoreCatch, avgHighScoreTime FROM patterns WHERE uid IN (?);',
        [patternUIDs]
      )

      // if there are no patterns associated with the uids
      if (patterns.length === 0) {
        return
      }

      // eslint-disable-next-line prettier/prettier
      const {maxAvgCatch, maxAvgTime} = await module.exports.getMaxAvgHighScores()

      const idToWeights = await module.exports.getScoringWeights(patternUIDs)

      const update = []
      let query = ''

      // for each pattern
      for (let i = 0; i < patterns.length; i++) {
        // get associated weights
        let w = idToWeights[patterns[i].uid]

        // default to empty weights if no records exist for that pattern
        if (!w) w = { catchWeight: 0, timeWeight: 0 }

        // determine relative difficulty of pattern for each scoring method
        const catchDifficulty =
          maxAvgCatch > 0 ? patterns[i].avgHighScoreCatch / maxAvgCatch : 0
        const timeDifficulty =
          maxAvgTime > 0 ? patterns[i].avgHighScoreTime / maxAvgTime : 0

        // compute weighted average of two relative difficulties to get overall relative difficulty
        const relDifficulty =
          w.catchWeight * catchDifficulty + w.timeWeight * timeDifficulty

        // compute actual difficulty as number of objects scaled up by relative difficulty (only if rel. difficulty non-zero)
        let difficulty = patterns[i].numObjects
        if (relDifficulty > 0) difficulty *= 2 - relDifficulty

        // add UID and difficulty to update params, extend update query
        update.push(patterns[i].uid, difficulty)
        query += ' WHEN uid = ? THEN ?'
      }

      await pool.query(
        `UPDATE patterns SET difficulty = CASE${query} ELSE difficulty END;`,
        update
      )

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // handle a change in pattern difficulty for a subset of patterns, updating users scores / rankings accordingly
  handleDifficultyChange: async (affectedPatterns, affectedUsers) => {
    try {
      if (!(affectedPatterns && affectedPatterns.length > 0)) {
        throw new Error(
          'Cannot handle difficulty change with no patterns given'
        )
      }

      // update pattern difficulties appropriatel
      await module.exports.calcDifficulties(affectedPatterns)

      // if there are no affectred users do not update their scores and ranks
      if (!(affectedUsers && affectedUsers.length > 0)) {
        return
      }

      await userController.calcScores(affectedUsers)
      await userController.updateRanks()

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*	Maintains all important info of patterns that have been affected by some change.
		Will update local scores / ranks, check for new max averages, update
		pattern difficulties appropriately and recalculate user scores / global
    rankings as necessary. */
  maintainInfo: async (affectedPatterns) => {
    try {
      // if there are no affected patterns, throw an error
      if (!(affectedPatterns && affectedPatterns.length > 0)) {
        throw new Error('Cannot maintain pattern info with no patterns given')
      }

      // recalculate record scores & local ranks in affected patterns
      await recordsController.updateScoresAndRanks(affectedPatterns)

      // get current max averages
      const {
        maxAvgCatch: oldMaxAvgCatch,
        maxAvgTime: oldMaxAvgTime
      } = await module.exports.getMaxAvgHighScores()

      // update the average high scores for affected patterns
      await module.exports.updateAvgHighScores(affectedPatterns)

      // get NEW max averages after update
      const {
        maxAvgCatch: newMaxAvgCatch,
        maxAvgTime: newMaxAvgTime
      } = await module.exports.getMaxAvgHighScores()

      // determine which users are affected by changes in the affected patterns
      const affectedUsers = userController.getByPatterns(affectedPatterns)

      let patternsToUpdate
      let usersToUpdate

      // if max averages changed
      if (
        newMaxAvgCatch !== oldMaxAvgCatch ||
        newMaxAvgTime !== oldMaxAvgTime
      ) {
        patternsToUpdate = await module.exports.getAll(true) // update ALL patterns
        usersToUpdate = await userController.getAll(true) // update ALL users
      } else {
        patternsToUpdate = affectedPatterns // only update affected patterns
        usersToUpdate = affectedUsers // only update affected users
      }

      // update pattern difficulties appropriately & handle ripple effect
      await module.exports.handleDifficultyChange(
        patternsToUpdate,
        usersToUpdate
      )

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
