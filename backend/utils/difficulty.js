/* eslint-disable no-param-reassign */
const pool = require('../queries/connection')
const Errors = require('./errors')

module.exports = {
  scaleDifficulties: async (patterns) => {
    try {
      // get the maximum difficulty from patterns
      const max = await pool.query(
        'SELECT MAX(difficulty) AS max FROM patterns;'
      )

      if (max.length === 0) {
        throw new Error('Failed to determine max pattern difficulty')
      }

      const maxDiff = max[0].max

      for (let i = 0; i < patterns.length; i++) {
        // scale all difficulties out of 10 (human-readable)
        patterns[i].difficulty = 10 * (patterns[i].difficulty / maxDiff)

        // round off difficulty
        patterns[i].difficulty = patterns[i].difficulty.toFixed(2)
      }

      return patterns
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
