<template>
  <v-container fluid>
    <v-row justify="center">
      <v-card width="70%" class="pa-5">
        <v-row align="center" justify="center">
          <v-col cols="8">
            <v-text-field
              ref="searchQuery"
              v-on:keyup.enter="search()"
              v-model="query"
              placeholder="Search"
              prepend-inner-icon="mdi-magnify"
              hide-details
              single-line
              outlined
              dense
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row align="center" justify="space-around">
          <v-col cols="4">
            <v-radio-group v-model="isPattern" @change="search()" row>
              <v-radio :value="false" label="Search Users"></v-radio>
              <v-radio :value="true" label="Search Patterns"></v-radio>
            </v-radio-group>
          </v-col>
          <v-col cols="4" align="center">
            <v-select
              v-if="isPattern"
              @change="search()"
              v-model="numObjects"
              :items="allNumObjects"
              item-value="numObjects"
              item-text="numObjects"
              label="Number of Objects"
              solo
            >
              <template v-slot:selection="{ item }">
                <span v-if="!item">All patterns</span>
                <span v-else>{{ item.numObjects }}-object patterns</span>
              </template>
              <template v-slot:item="{ item }">
                <span v-if="!item">All</span>
                <span v-else>{{ item.numObjects }}-object</span>
              </template>
            </v-select>
          </v-col>
          <v-col cols="4" align="center">
            <v-select
              v-model="orderBy"
              @change="search()"
              :items="possibleOrderBy"
              item-value="scary"
              item-text="friendly"
              label="Order By"
              solo
            >
              <template v-slot:selection="{ item }">
                Order by {{ item.friendly }}
              </template>
            </v-select>
          </v-col>
        </v-row>
      </v-card>
      <v-card
        v-if="
          (results.patterns && results.patterns.length > 0) ||
            (results.users && results.users.length > 0)
        "
        width="70%"
        class="pa-5 mt-4"
      >
        <template v-if="results.patterns">
          <v-row
            v-for="pattern in results.patterns"
            :key="`pattern-${pattern.uid}`"
            justify="center"
          >
            <v-col cols="12" md="12">
              <PatternResult :pattern="pattern"></PatternResult>
            </v-col>
          </v-row>
        </template>
        <template v-if="results.users">
          <v-row
            v-for="user in results.users"
            :key="`user-${user.uid}`"
            justify="center"
          >
            <v-col cols="12" md="12">
              <UserResult :user="user"></UserResult>
            </v-col>
          </v-row>
        </template>
      </v-card>
    </v-row>
  </v-container>
</template>

<script>
import PatternResult from '@/components/search/PatternResult.vue'
import UserResult from '@/components/search/UserResult.vue'

export default {
  components: {
    PatternResult,
    UserResult
  },
  data() {
    return {
      isPattern: true,
      query: '',
      orderBy: 'RELEVANCE',
      numObjects: null,
      limit: 50,
      results: []
    }
  },
  computed: {
    possibleOrderBy() {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      this.orderBy = 'RELEVANCE'
      if (this.isPattern) {
        return [
          { scary: 'RELEVANCE', friendly: 'Relevance' },
          { scary: 'DIFFICULTY', friendly: 'Difficulty' },
          { scary: 'NUM_OBJECTS', friendly: 'Number of Objects' },
          { scary: 'POPULARITY', friendly: 'Popularity' }
        ]
      }

      return [
        { scary: 'RELEVANCE', friendly: 'Relevance' },
        { scary: 'RANK', friendly: 'Rank' }
      ]
    }
  },
  async asyncData({ app, error }) {
    try {
      const allNumObjects = await app.$axios.$get('/patterns/objects')
      allNumObjects.unshift(null) // add null to beginning of the list to specify all patterns
      return {
        allNumObjects
      }
    } catch (err) {
      error(err)
    }
  },
  // search when page loaded
  async beforeMount() {
    await this.search()
  },
  methods: {
    async search() {
      try {
        if (this.isPattern) {
          this.results = await this.$axios.$get('/search/patterns', {
            params: {
              query: this.query,
              orderBy: this.orderBy,
              numObjects: this.numObjects,
              limit: this.limit
            }
          })
          return
        }
        this.results = await this.$axios.$get('/search/users', {
          params: {
            query: this.query,
            orderBy: this.orderBy,
            limit: this.limit
          }
        })
        return
      } catch (err) {
        this.$nuxt.error(err)
      }
    }
  }
}
</script>

<style></style>
