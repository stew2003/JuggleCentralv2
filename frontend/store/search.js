export const state = () => ({
  results: [],
  query: '',
  searched: false,
  isPattern: false
})

export const mutations = {
  SET_RESULTS(state, results) {
    state.results = results
    state.searched = true
  },
  SET_SEARCHED(state, searched) {
    state.searched = searched
  },
  SET_QUERY(state, query) {
    state.query = query
  },
  SET_ISPATTERN(state, isPattern) {
    state.isPattern = isPattern
  }
}

export const actions = {
  async get_results(
    { commit, error },
    { query, orderBy, numObjects, limit, isPattern }
  ) {
    try {
      const results = await this.$axios.$get(
        `/search/${isPattern ? 'patterns' : 'users'}`,
        {
          params: { query, orderBy, numObjects, limit }
        }
      )
      commit('SET_QUERY', query)
      commit('SET_ISPATTERN', isPattern)
      commit('SET_RESULTS', results)
      return
    } catch (err) {
      error(err)
    }
  }
}
