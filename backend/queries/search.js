const pool = require('./connection')
const Errors = require('../utils/errors')

module.exports = {
  /*  Search the users table, matching name against given query.
		  Empty query returns full table */
  searchUsers: async ({ query, orderBy, limit }, count = false) => {
    // determine what to limit by, if anything
    const limitQuery = limit && limit > 0 ? ' LIMIT ?' : ''

    // add wildcard to search query to broaden search
    const q = query === '' ? query : `${query}*`
    // add limit as argument to query if given
    const args = [q, q, q]
    if (limitQuery !== '') args.push(limit)

    try {
      const users = await pool.query(
        `SELECT
          uid,
          name,
          bio,
          userRank,
          score,
          MATCH (name) AGAINST (? IN BOOLEAN MODE) AS termScore
        FROM users
        WHERE MATCH (name) AGAINST (? IN BOOLEAN MODE) OR ? = ""
        ORDER BY termScore DESC${limitQuery};`,
        args
      )

      // if a specific order requested
      if (orderBy) {
        let compare

        // eslint-disable-next-line default-case
        switch (orderBy) {
          // compare on the basis of user rank
          case 'RANK':
            compare = (a, b) => {
              return a.userRank - b.userRank
            }
            break
        }

        // sort with the specified comparator
        if (compare) users.sort(compare)

        // if no specified order and query empty, order by UID to push more recently created users to top
      } else if (q === '') {
        users.sort((a, b) => {
          return b.uid - a.uid
        })
      }

      // if THIS call is just for counting the results, then DONT COUNT THE OTHER CATEGORY
      if (count) {
        return { users }
      }

      // count how many results for this query exist under patterns (with NO limit and count flag ON)
      const patterns = await module.exports.searchPatterns({ query }, true)
      return { users, numPatternResult: patterns.patterns.length }
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  /*  Searches the patterns table, matching name & description against the given query.
		  If numObjects given, filter to include only patterns with that number of objects.
		  Empty query returns full table
		  If orderBy given, use this to order the results that match against the query.
		  OrderBy can be: 'DIFFICULTY', 'NUM_OBJECTS', 'POPULARITY', or null to order by relevance */
  searchPatterns: async (
    { query, numObjects, orderBy, limit },
    count = false
  ) => {
    // determine what to limit by, if anything
    const limitQuery = limit && limit > 0 ? ' LIMIT ?' : ''

    // add wildcard to search query to broaden search
    const q = query === '' ? query : `${query}*`

    // determine if we should filter by number of objects
    const notFiltering = !numObjects

    // if limiting query, add limit to arguments
    const args = [q, q, q, numObjects, notFiltering]
    if (limitQuery !== '') args.push(limit)

    try {
      // get all patterns that match against the query
      const patterns = await pool.query(
        `SELECT
          uid,
          name,
          description,
          numObjects,
          GIF,
          difficulty,
          MATCH (name, description) AGAINST (? IN BOOLEAN MODE) AS termScore
        FROM patterns
        WHERE
          (MATCH (name, description) AGAINST (? IN BOOLEAN MODE) OR ? = "")
          AND (numObjects = ? OR ?)
        ORDER BY termScore DESC${limitQuery};`,
        args
      )

      // only order if there are patterns
      if (patterns.length > 0) {
        // get number of users that participate in each pattern
        const participation = await pool.query(
          `SELECT patternUID, COUNT(*) AS numUsers FROM
          (SELECT * FROM records GROUP BY userUID, patternUID ORDER BY patternUID) AS x
        GROUP BY patternUID;`
        )

        const uidToPopularity = {}

        // map pattern UID to its number of participants
        for (let i = 0; i < participation.length; i++) {
          uidToPopularity[participation[i].patternUID] =
            participation[i].numUsers
        }

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
          patterns[i].difficulty = (10 * patterns[i].difficulty) / maxDiff

          // round off difficulty
          patterns[i].difficulty = patterns[i].difficulty.toFixed(2)

          // add number of users to pattern object
          patterns[i].numUsers = uidToPopularity[patterns[i].uid]

          // default undefined values to no participants
          if (!patterns[i].numUsers) patterns[i].numUsers = 0
        }

        // comparator function used to sort results
        let compare

        // if a specific ordering requested
        if (orderBy) {
          // eslint-disable-next-line default-case
          switch (orderBy) {
            // compare on the basis of pattern difficulty
            case 'DIFFICULTY':
              compare = (a, b) => {
                return b.difficulty - a.difficulty
              }
              break
            // compare on the basis of number of objects
            case 'NUM_OBJECTS':
              compare = (a, b) => {
                return b.numObjects - a.numObjects
              }
              break
            // compare on the basis of number of participants
            case 'POPULARITY':
              compare = (a, b) => {
                return b.numUsers - a.numUsers
              }
              break
          }

          // sort with the specified comparator
          if (compare) patterns.sort(compare)

          /*	if no specified order, and query empty (just browsing), order by UID to push more
        recently created patterns to top */
        } else if (q === '') {
          patterns.sort((a, b) => {
            return b.uid - a.uid
          })
        }
      }

      // if THIS call is just for counting the results, then DONT COUNT THE OTHER CATEGORY
      if (count) {
        return { patterns }
      }

      // count how many results for this query exist under users (with NO limit and count flag ON)
      const users = await module.exports.searchUsers({ query }, true)
      return { patterns, numUserResults: users.users.length }
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  }
}
