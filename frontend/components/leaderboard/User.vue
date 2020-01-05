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
