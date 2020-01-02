<template>
  <v-card>
    <v-row no-gutters>
      <v-col cols="12" md="6">
        <v-card-title>{{ user.name }} joined JuggleCentral</v-card-title>
      </v-col>
      <v-spacer> </v-spacer>
      <v-col cols="6" md="5">
        <v-card-title>
          Rank: {{ user.userRank }} Score: {{ user.score }}</v-card-title
        >
      </v-col>
    </v-row>
    <v-divider></v-divider>
    <v-card-text>
      {{ bio }}<v-spacer></v-spacer>
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
