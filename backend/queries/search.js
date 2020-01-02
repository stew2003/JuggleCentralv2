const pool = require('./connection')
const Errors = require('../utils/errors')

module.exports = {
  /*  Search the users table, matching name against given query.
		  Empty query returns full table */
  searchUsers: async (query, orderBy, limit) => {
    // determine what to limit by, if anything
    const limitQuery = limit && limit > 0 ? ' LIMIT ?' : ''

    // add wildcard to search query to broaden search
    const q = query === '' ? query : `${query}*`

    // add limit as argument to query if given
    const args = [q, q, q]
    if (limitQuery !== '') args.push(limit)

    try {
      const results = await pool.query(
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
        if (compare) results.sort(compare)

        // if no specified order and query empty, order by UID to push more recently created users to top
      } else if (q === '') {
        results.sort((a, b) => {
          return b.uid - a.uid
        })
      }

      return results
    } catch (err) {
      throw new Errors.InternalServerError(err.message)
    }
  },

  // TODO
  /*  Searches the patterns table, matching name & description against the given query.
		  If numObjects given, filter to include only patterns with that number of objects.
		  Empty query returns full table
		  If orderBy given, use this to order the results that match against the query.
		  OrderBy can be: 'DIFFICULTY', 'NUM_OBJECTS', 'POPULARITY', or null to order by relevance */
  searchPatterns: async (query, numObjects, orderBy, limit) => {}
}
