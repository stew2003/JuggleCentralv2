/* eslint-disable no-use-before-define */
const pool = require('./connection')
const Errors = require('../utils/errors')
const sys = require('../utils/settings')

module.exports = {
  // get one of the users
  get: async ({ uid }) => {
    try {
      const user = await pool.query('SELECT * FROM users WHERE uid = ?;', [uid])

      if (user.length === 0) {
        throw new Error(`There is no user with uid - ${uid}`)
      }

      return user[0]
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get all of the users
  getAll: async (uid = false) => {
    try {
      const users = await pool.query('SELECT * FROM users;')
      if (uid) {
        return users.map((user) => user.uid)
      }
      return users
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get who was associated with patternUIDs
  getByPatterns: async (patternUIDs) => {
    try {
      // no users are affected by no patterns
      if (!(patternUIDs && patternUIDs.length > 0)) {
        return []
      }

      const records = await pool.query(
        `SELECT userUID FROM records WHERE patternUID IN (?) GROUP BY userUID;`,
        [patternUIDs]
      )
      // return an array of user uids
      return records.map((r) => r.userUID)
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get the UID of a user from a given record
  getByRecord: async (uid) => {
    try {
      const users = await pool.query(
        'SELECT userUID FROM records WHERE uid = ?;',
        [uid]
      )

      if (users.length === 0) {
        throw new Error(`There is no user associated with record ${uid}`)
      }

      return users[0].userUID
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get all users, ordered by rank
  getLeaderboard: async () => {
    try {
      return await pool.query('SELECT * FROM users ORDER BY userRank ASC;')
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get recently created user accounts
  getRecentCreations: async ({ limit, offset }) => {
    try {
      if (!(limit && limit > 0 && offset && offset >= 0)) {
        throw new Error('Cannot get recent new users with no limit')
      }

      // order users by time created to get most recent
      return await pool.query(
        'SELECT users.*, 1 = 1 AS isNewUserActivity FROM users ORDER BY timeCreated DESC LIMIT ?, ?;',
        [offset, limit]
      )
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

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

  // delete a user and change rankings accordingly
  delete: async ({ uid }) => {
    try {
      // get all patterns affected by this users deletion
      const affectedPatterns = await patternController.getByUsers([uid])

      // actually remove the user and associated records from db
      await pool.query('DELETE FROM users WHERE uid = ?;', [uid])

      // if any patterns are affected
      if (affectedPatterns.length > 0) {
        // update their cached info accordingly
        await patternController.maintainInfo(affectedPatterns)
      }

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // calculate global user scores on a subset of users, or all users if no subset specified
  calcScores: async (uids) => {
    try {
      // if no users are passed in, do nothing
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
  updateRanks: async () => {
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
  },

  /*	Redetermine the isPersonalBest flag for a given user competing in a given subset of patterns.
		Operates on both catch- and time-based records.
		If no subset given, it will update personal bests for all patterns in which the user competes */
  maintainPBs: async (userUID, patternUIDs) => {
    try {
      // default all records under this user & pattern to NOT the PB
      await pool.query(
        'UPDATE records SET isPersonalBest = 0 WHERE userUID = ? AND patternUID IN (?);',
        [userUID, patternUIDs]
      )

      const records = await pool.query(
        `
        SELECT * FROM records JOIN
          (SELECT
            userUID,
            patternUID,
            duration IS NOT NULL AS isTimeBased,
            catches IS NOT NULL AS isCatchBased,
            MAX(duration) AS maxDuration,
            MAX(catches) AS maxCatches
          FROM records
          WHERE
            userUID = ?
            AND patternUID IN (?)
          GROUP BY
            isTimeBased,
            isCatchBased,
            patternUID)
          AS pbs
        ON
          (
            records.duration = pbs.maxDuration
            OR records.catches = pbs.maxCatches
          )
          AND records.patternUID = pbs.patternUID
        WHERE
          records.userUID = ?
          AND records.patternUID IN (?)
        ORDER BY records.timeRecorded ASC;
        `,
        [userUID, patternUIDs, userUID, patternUIDs]
      )

      // if there are no records to flag as personal best justs return
      if (records.length === 0) {
        return
      }

      // association of pattern UID to its time and catch PB's for this user
      const patternToPBs = {}

      /*	Get each pattern's time and catch personal bests from the query result
        This will overwrite with each progressive row, so if duplicate PBs exist for a given pattern / category,
        the most recent record will be the only one marked with isPersonalBest = 1 (result is already ordered by timeRecorded) */
      for (let i = 0; i < records.length; i++) {
        const pUID = records[i].patternUID

        // if no existing object for this pattern, initialize
        if (!patternToPBs[pUID]) {
          patternToPBs[pUID] = {}
        }

        if (records[i].isTimeBased === 1) {
          // store record UID as time PB for this pattern
          patternToPBs[pUID].timePBuid = records[i].uid
        } else {
          // store record UID as catch PB for this pattern
          patternToPBs[pUID].catchPBuid = records[i].uid
        }
      }

      // array to hold UIDs of all records that will be made PBs
      const uids = []

      // for each pattern
      Object.keys(patternToPBs).forEach((pUID) => {
        const PBs = patternToPBs[pUID]

        // if PBs exist, add their record UIDs to update query arguments
        if (PBs.catchPBuid) uids.push(PBs.catchPBuid)
        if (PBs.timePBuid) uids.push(PBs.timePBuid)
      })

      await pool.query(
        'UPDATE records SET isPersonalBest = 1 WHERE uid IN (?);',
        [uids]
      )

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}

// require cyclial modules after module.exports
const patternController = require('./patterns')
