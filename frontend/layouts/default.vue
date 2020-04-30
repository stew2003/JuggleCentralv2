<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          v-for="(item, i) in items"
          :key="`button-${i}`"
          :to="item.to"
          text
        >
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-col cols="2">
        <v-text-field
          v-model="query"
          v-on:keyup.enter="search()"
          placeholder="Search"
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'JuggleCentral',
      items: [
        {
          icon: 'mdi-text-box-search-outline',
          title: 'Browse Patterns',
          to: '/search'
        },
        {
          icon: 'mdi-podium',
          title: 'Leaderboard',
          to: '/leaderboard'
        }
      ],
      query: ''
    }
  },
  methods: {
    async search() {
      try {
        await this.$store.dispatch('search/get_results', {
          query: this.query,
          orderBy: 'RELEVANCE',
          limit: 200,
          isPattern: true
        })
        this.query = ''
        this.$router.push('/search')
        return
      } catch (err) {
        this.$nuxt.error(err)
      }
    }
  }
}
</script>

<style lang="scss">
.v-application,
.v-application .title,
.v-application .headline {
  font-family: $body-font-family, sans-serif !important;
}
</style>
