const pool = require('./connection')
const Errors = require('../utils/errors')
const sys = require('../utils/settings')

module.exports = {
  // create a new administrator
  new: async ({ name, email, isAdmin }) => {
    try {
      let rank

      const lowest = await pool.query(
        'SELECT score, userRank FROM users WHERE userRank = (SELECT MAX(userRank) FROM users) LIMIT 1;'
      )

      // if there is a lowest ranked user
      if (lowest.length > 0) {
        const lowestRank = lowest[0].userRank
        const lowestScore = lowest[0].score

        // if the lowest ranked user also has a score of 0
        if (lowestScore === 0) {
          rank = lowestRank
        } else {
          // if the lowest ranked user has a better score than 0, make an even lower rank
          rank = lowestRank + 1
        }
      } else {
        // if no one is in the db then you are the best
        rank = 1
      }

      // create a new user
      const newUser = await pool.query(
        'INSERT INTO users (timeCreated, userRank, name, email, isAdmin) VALUES (NOW(), ?, ?, ?, ?); SELECT * FROM users WHERE uid = LAST_INSERT_ID();',
        [rank, name, email, isAdmin]
      )

      if (!newUser[1][0]) {
        throw new Errors.InternalServerError(
          'The user was not added correctly.'
        )
      }

      return newUser[1][0]
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // edit the fields of a user
  edit: async ({ uid, name, bio }) => {
    try {
      await pool.query('UPDATE users SET name = ?, bio = ? WHERE uid = ?;', [
        name,
        bio,
        uid
      ])
      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // edit the admin status of a user
  adminStatus: async ({ uid, isAdmin }) => {
    try {
      await pool.query('UPDATE users SET isAdmin = ? WHERE uid = ?;', [
        isAdmin,
        uid
      ])
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // TODO ADD RANKING!!!!!!
  // delete a user and change rankings accordingly
  delete: async ({ uid }) => {
    try {
      await pool.query('DELETE FROM users WHERE uid = ?;', [uid])
      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get all of the users
  getAll: async () => {
    try {
      return await pool.query('SELECT * FROM users;')
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // calculate global user scores on a subset of users, or all users if no subset specified
  calcScores: async (uids) => {
    try {
      // if there arent any uids throw an error
      if (!(uids && uids.length > 0)) {
        throw new Error('Cannot calcualte scores for no users')
      }

      // initialize all user scores to 0
      await pool.query('UPDATE users SET score = 0 WHERE uid IN (?);', [uids])

      /*	Get all of each user's PB records (both catches and time, so we'll have to choose the most recent),
					ordered by user, pattern UID, and timeRecorded so the first in the pair of max 2 records per pattern will
          be the more recent one. */
      const records = await pool.query(
        `SELECT r.userUID, r.score, r.timeRecorded, p.uid AS patternUID, p.difficulty as patternDifficulty FROM records r
        JOIN patterns p ON r.patternUID = p.uid WHERE r.isPersonalBest = 1 AND r.userUID IN (?) ORDER BY r.userUID, patternUID ASC, timeRecorded DESC;`,
        [uids]
      )

      const userScores = {}

      // for each record, add the record score of most recent PB to user score
      for (let i = 0; i < records.length; i += 1) {
        // if no score in userScores mapping yet, default to 0
        if (!userScores[records[i].userUID]) {
          userScores[records[i].userUID] = 0
        }

        // user score = (record score) * (pattern difficulty)
        userScores[records[i].userUID] +=
          records[i].score * records[i].patternDifficulty

        // if next record exists and is from same pattern
        if (
          i + 1 < records.length &&
          records[i + 1].patternUID === records[i].patternUID
        ) {
          i += 1 // skip the next record, as it's for the same pattern but is less recent than this one
        }
      }

      // for each user for which we calculated an updated score
      let query = ''
      const args = []
      Object.keys(userScores).forEach((userUID) => {
        // add user UID, user score to query arguments
        args.push(userUID, userScores[userUID] * sys.USER_SCORE_SCALING_FACTOR)

        // build query
        query += ' WHEN uid = ? THEN ?'
      })

      // if there is something to update
      if (args.length > 0) {
        // update the user scores
        await pool.query(
          `UPDATE users SET score = CASE${query} ELSE score END;`,
          args
        )
      }

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // convert existing user scores into user ranks for all users
  updateGlobalRanks: async () => {
    try {
      /*	This gets all the possible scores (no duplicates) from the users table, ordered highest to lowest. We simply need to rank them and
			then UPDATE to add that same rank to any users who share that score. */
      const scores = await pool.query(
        'SELECT score FROM users GROUP BY score ORDER BY score DESC;'
      )
      const args = []
      let query = ''

      // give each score a rank
      for (let i = 0; i < scores.length; i += 1) {
        args.push(scores[i].score, i + 1)
        query += ' WHEN score = ? THEN ?'
      }

      // if there is something to update
      if (query) {
        // update the user ranks accordingly, giving each user the rank that corresponds with their score
        await pool.query(
          `UPDATE users SET userRank = CASE${query} ELSE userRank END;`,
          args
        )
      }

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
