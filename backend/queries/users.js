const pool = require('./connection')
const Errors = require('../utils/errors')

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
      const users = await pool.query('SELECT * FROM users;')
      return users
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
