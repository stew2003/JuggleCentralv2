<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title class="display-2">Leaderboard</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-row
              v-for="item in leaderboard"
              :key="key(item)"
              justify="center"
            >
              <v-col class="py-1">
                <User :user="item" />
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import User from '@/components/leaderboard/User.vue'

export default {
  components: {
    User
  },
  async asyncData({ app, error }) {
    try {
      const leaderboard = await app.$axios.$get('/users/leaderboard')
      return { leaderboard }
    } catch (err) {
      error(err)
    }
  },
  methods: {
    key(item, index) {
      return `user-${item.uid}`
    }
  }
}
</script>
