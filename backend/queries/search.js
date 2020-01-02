const pool = require('./connection')
const Errors = require('../utils/errors')

module.exports = {
  // TODO:
  /*  Search the users table, matching name against given query.
		  Empty query returns full table */
  searchUsers: async (query, orderBy, limit) => {},

  // TODO:
  /*  Searches the patterns table, matching name & description against the given query.
		  If numObjects given, filter to include only patterns with that number of objects.
		  Empty query returns full table
		  If orderBy given, use this to order the results that match against the query.
		  OrderBy can be: 'DIFFICULTY', 'NUM_OBJECTS', 'POPULARITY', or null to order by relevance */
  searchPatterns: async (query, numObjects, orderBy, limit) => {}
}
