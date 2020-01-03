<template>
  <v-card>
    <v-card-title>
      <span class="title font-weight-light">{{ user.name }}</span>
      <v-spacer></v-spacer>
      <span class="subtitle-2">Rank: {{ user.userRank }}</span>
      <span class="subtitle-2 ml-5">Score: {{ user.score }}</span>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      {{ bio }}
      <v-spacer></v-spacer>
      {{ user.relativeTime }}
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

<style></style>
