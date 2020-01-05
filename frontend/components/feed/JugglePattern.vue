<template>
  <v-card>
    <v-card-title>
      <span class="title text-truncate mr-10">
        <nuxt-link :to="`/pattern/${pattern.uid}`" class="name">
          {{ pattern.name }}
        </nuxt-link>
        was created
      </span>
      <v-spacer></v-spacer>
      <div>
        <span class="subtitle-2">
          Number of Objects : {{ pattern.numObjects }}
        </span>
        <span class="subtitle-2 ml-5">
          Difficulty: {{ pattern.difficulty }}
        </span>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <span>Average High Score Catches: {{ pattern.avgHighScoreCatch }}</span>
      <v-spacer></v-spacer>
      <span>Average High Score Time: {{ pattern.avgHighScoreTime }}</span>
      <v-spacer></v-spacer>
      <span>{{ description }}</span>
      <v-spacer></v-spacer>
      <div class="text-right white--text mt-5" style="width: 100%;">
        {{ pattern.relativeTime }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'JugglePattern',
  props: {
    pattern: {
      type: Object,
      required: true
    }
  },
  computed: {
    description() {
      if (!this.pattern.description || this.pattern.description.length < 75) {
        return this.pattern.description
      }

      return `${this.pattern.description.slice(0, 75)}...`
    }
  }
}
</script>

<style scoped>
.name {
  text-decoration: none !important;
}
</style>
