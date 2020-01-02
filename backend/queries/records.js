/* eslint-disable no-use-before-define */
const moment = require('moment')
const pool = require('./connection')
const Errors = require('../utils/errors')

module.exports = {
  // get one of the records
  get: async ({ uid }) => {
    try {
      const records = await pool.query('SELECT * FROM records WHERE uid = ?;', [
        uid
      ])

      if (records.length === 0) {
        throw new Error(`There is no record with uid - ${uid}`)
      }

      return records[0]
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get all of the records
  getAll: async (uid = false) => {
    try {
      const records = await pool.query('SELECT * FROM records;')
      if (uid) {
        return records.map((r) => r.uid)
      }
      return records
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*	Get all the records of a given user.
		Will JOIN to get pattern name. ORDER BY patternUID, catches, duration.
		Splits into array of pattern objects with uid, name, and all catch and time records for this user */
  getByUser: async ({ uid: userUID }) => {
    try {
      // if there is no userUID given, throw an error
      if (!userUID) {
        throw new Error('Cannot get records for a user when no users are given')
      }

      const records = await pool.query(
        'SELECT r.*, p.name AS patternName FROM records r JOIN patterns p ON r.patternUID = p.uid WHERE r.userUID = ? ORDER BY r.patternUID, r.duration DESC, r.catches DESC;',
        [userUID]
      )

      // if there are no records just return an empty array
      if (records.length === 0) {
        return []
      }

      const patterns = []
      const idToPattern = {}

      // for each record
      for (let i = 0; i < records.length; i++) {
        const r = records[i]

        // convert date into human-readable format
        r.date = moment(r.timeRecorded)
        if (r.date) r.date = r.date.format('M/D/YYYY [at] h:mm A')

        // if no existing object for this record's pattern
        if (!idToPattern[r.patternUID]) {
          // create new object to manage data for this pattern
          idToPattern[r.patternUID] = {
            uid: r.patternUID,
            name: r.patternName,
            catchRecords: [],
            timeRecords: []
          }
        }

        // insert into the appropriate array of records within pattern object
        if (r.catches != null) {
          idToPattern[r.patternUID].catchRecords.push(r)
          idToPattern[r.patternUID].catchRecordsExist = true
        } else {
          idToPattern[r.patternUID].timeRecords.push(r)
          idToPattern[r.patternUID].timeRecordsExist = true
        }
      }

      // add all pattern objects into one array
      Object.keys(idToPattern).forEach((patternUID) => {
        patterns.push(idToPattern[patternUID])
      })

      return patterns
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*	Get all records for a specific pattern by UID. JOINs on user name. ORDER BY catches, duration;
		This should both split the records into two “sections” and sort them properly in each category.
		Splits into catch-based and time-based records, returns object with both arrays. */
  getByPattern: async ({ uid: patternUID }) => {
    try {
      // if there is no userUID given, throw an error
      if (!patternUID) {
        throw new Error(
          'Cannot get records for a pattern when no pattern is given'
        )
      }

      const records = await pool.query(
        'SELECT r.*, u.name AS userName, u.userRank FROM records r JOIN users u ON r.userUID = u.uid WHERE r.patternUID = ? ORDER BY r.catches DESC, r.duration DESC;',
        [patternUID]
      )

      // object to store records for this pattern
      const recordsObj = {
        catchRecords: [],
        timeRecords: []
      }

      // for each record associated with this pattern
      for (let i = 0; i < records.length; i++) {
        // convert date into human-readable format
        records[i].date = moment(records[i].timeRecorded)
        if (records[i].date) {
          records[i].date = records[i].date.format('M/D/YYYY [at] h:mm A')
        }

        // if this record uses catches
        if (records[i].catches !== undefined) {
          // add it to the catches part of the split records
          recordsObj.catchRecords.push(records[i])
        } else {
          // add the duration to the duration part of the split records
          recordsObj.timeRecords.push(records[i])
        }
      }

      return recordsObj
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // get recently set records which are personal bests
  getRecentPersonalBests: async ({ limit, offset }) => {
    try {
      // select only personal bests from records, joining to get user and pattern name, limiting size of response
      return await pool.query(
        `SELECT
          r.*,
          r.timeRecorded AS timeCreated,
          u.name AS userName,
          p.name AS patternName,
          1 = 1 AS isPBActivity
        FROM
          records r JOIN users u ON r.userUID = u.uid
          JOIN patterns p ON r.patternUID = p.uid
        WHERE r.isPersonalBest = 1
        ORDER BY uid DESC
        LIMIT ?, ?;`,
        [offset, limit]
      )
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // add a new record
  new: async ({ userUID, patternUID, catches, duration, video }) => {
    try {
      // add the new record to db
      await pool.query(
        'INSERT INTO records (userUID, patternUID, catches, duration, video, timeRecorded) VALUES (?, ?, ?, ?, ?, NOW());',
        [userUID, patternUID, catches, duration, video]
      )

      // handle the change in records
      module.exports.handleChange(userUID, [patternUID])
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // edit the fields of an existing record
  edit: async ({ uid, patternUID, catches, duration, video }) => {
    try {
      // get both the user UID and the pattern UID BEFORE the edits are applied
      const UIDs = await pool.query(
        'SELECT userUID, patternUID FROM records WHERE uid = ?;',
        [uid]
      )

      if (UIDs.length === 0) {
        throw new Error('Cannot identify the pattern you requested to edit')
      }

      const { userUID, patternUID: oldPatternUID } = UIDs
      let affectedPatterns

      // if pattern changed
      if (oldPatternUID !== patternUID) {
        // both old and new pattern are affected
        affectedPatterns = [oldPatternUID, patternUID]
      } else {
        // only one pattern is affected
        affectedPatterns = [patternUID]
      }

      // apply the record update
      await pool.query(
        'UPDATE records SET patternUID = ?, catches = ?, duration = ?, video = ? WHERE uid = ?;',
        [patternUID, catches, duration, video, uid]
      )

      // handle the change in records
      module.exports.handleChange(userUID, affectedPatterns)
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // remove a record
  delete: async ({ uid }) => {
    try {
      const UIDs = await pool.query(
        'SELECT userUID, patternUID FROM records WHERE uid = ?;',
        [uid]
      )

      if (UIDs.length === 0) {
        throw new Error('Cannot identify the pattern you requested to edit')
      }

      const { userUID, patternUID } = UIDs

      await pool.query('DELETE FROM records WHERE uid = ?;', [uid])

      // handle the change in records
      module.exports.handleChange(userUID, [patternUID])
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*	Calculate the record scores for all PB records within a given subset of patterns,
    and update the local rank of each record */
  updateScoresAndRanks: async (patternUIDs) => {
    try {
      if (!(patternUIDs && patternUIDs.length > 0)) {
        throw new Error('Needs patterns to update')
      }

      /*	This gets all the relevant PB records for these patterns, grouped off by pattern, and within that,
			ordered catch records (best to worst) come first, then ordered duration records (best to worst) (converted to seconds already) */
      const records = await pool.query(
        'SELECT records.*, TIME_TO_SEC(duration) AS seconds FROM records WHERE isPersonalBest = 1 AND patternUID IN (?) ORDER BY patternUID, catches DESC, seconds DESC;',
        [patternUIDs]
      )

      // if there are not any records give up
      if (records.length < 1) {
        return
      }

      // arguments & query constraints for singular UPDATE query at the end
      const scoreArgs = []
      let scoreQuery = ''
      const rankArgs = []
      let rankQuery = ''

      // for each retrieved PB record
      for (let i = 0; i < records.length; i++) {
        let j = i
        let rank = 1

        // if this PB is a catch-based record
        if (records[i].catches) {
          // while we're still looking at a catch-based record
          while (j < records.length && records[j].catches) {
            // compute score as fraction of best catch-based value
            records[j].score = records[j].catches / records[i].catches

            // store UID and score as UPDATE arguments and add to update query
            scoreArgs.push(records[j].uid, records[j].score)
            scoreQuery += ' WHEN uid = ? THEN ?'

            // if this record has a lower score than the previous, start a new, lower rank
            if (i !== j && records[j].score < records[j - 1].score) {
              rank++
            }

            // add current rank to this record
            records[j].rank = rank

            // store UID and rank as UPDATE arguments, add to update query
            rankArgs.push(records[j].uid, records[j].rank)
            rankQuery += ' WHEN uid = ? THEN ?'

            // move to next record
            j++
          }
        }

        i = j // move i past all the catch-based records (if any)
        rank = 1 // reset the rank  back to 1 for time-based

        // if this record time-based
        if (i < records.length && records[i].seconds) {
          // while we're still looking at a time-based record
          while (j < records.length && records[j].seconds) {
            // calculate score as fraction of best time score
            records[j].score = records[j].seconds / records[i].seconds

            // store UID and score as UPDATE args, add to update query
            scoreArgs.push(records[j].uid, records[j].score)
            scoreQuery += ' WHEN uid = ? THEN ?'

            // if this record has a lower score than the previous, start a new, lower rank
            if (i !== j && records[j].score < records[j - 1].score) {
              rank++
            }

            // store rank in record
            records[j].rank = rank

            // store UID and rank as UPDATE args, add to query
            rankArgs.push(records[j].uid, records[j].rank)
            rankQuery += ' WHEN uid = ? THEN ?'

            // move to next record
            j++
          }
        }

        // move i to 1 before the last record we were looking at
        // (so that when the loop increments i, we will be at the start of a new pattern)
        i = j - 1
      }

      // add rank arguments to end of score args array
      const args = scoreArgs.concat(rankArgs)

      // apply updates to record scores & ranks
      await pool.query(
        `UPDATE records SET score = CASE${scoreQuery} ELSE score END, recordRank = CASE${rankQuery} ELSE recordRank END;`,
        args
      )

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // used to handle a new / edited / removed record by updating scores & ranks as needed
  handleChange: async (userUID, affectedPatterns) => {
    try {
      if (!userUID) {
        throw new Error('Some user must be affected by this record')
      }

      if (!(affectedPatterns && affectedPatterns.length > 0)) {
        throw new Error('Some patterns must be affected by this record')
      }

      // maintain the personal bests in patterns affected by this record (usually just one, possibly two with an edit and pattern change (old and new))
      await userController.maintainPBs(userUID, affectedPatterns)

      // maintain all pattern data in those affected by this change in record
      await module.exports.maintainPatternInfo(affectedPatterns)

      return
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}

// require cyclial modules after module.exports
const userController = require('./users')
