<template>
  <v-card>
    <v-card-title>
      <span class="title text-truncate mr-10">
        <nuxt-link
          :to="`/user/${user.uid}`"
          class="name teal--text text--accent-2"
        >
          {{ user.name }}
        </nuxt-link>
        joined JuggleCentral
      </span>
      <v-spacer></v-spacer>
      <div>
        <span class="subtitle-2 mr-3">
          Rank
        </span>
        <span class="headline font-weight-bold teal--text text--accent-2">
          {{ user.userRank }}
        </span>
        <span class="grey--text text--lighten-1 mx-2">|</span>
        <span class="headline font-weight-bold teal--text text--accent-2">
          {{ user.score }}
        </span>
        <span class="subtitle-2 ml-3">Score</span>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <span>{{ bio }}</span>
      <v-spacer></v-spacer>
      <div class="text-right grey--text mt-5" style="width: 100%;">
        {{ user.relativeTime }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'User',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  computed: {
    bio() {
      if (!this.user.bio || this.user.bio.length < 75) {
        return this.user.bio
      }

      return `${this.user.bio.slice(0, 75)}...`
    }
  }
}
</script>

<style scoped>
.name {
  text-decoration: none !important;
}
.name:hover {
  color: #a7ffeb !important;
}
</style>
