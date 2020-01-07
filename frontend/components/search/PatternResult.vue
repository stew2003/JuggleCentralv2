<template>
  <v-card>
    <v-card-title>
      <span class="title text-truncate mr-10">
        <nuxt-link
          :to="`/pattern/${pattern.uid}`"
          class="name pink--text text--accent-2"
        >
          {{ pattern.name }}
        </nuxt-link>
      </span>
      <v-spacer></v-spacer>
      <div>
        <span class="subtitle-2 mr-3">
          Objects
        </span>
        <span class="headline font-weight-bold pink--text text--accent-2">
          {{ pattern.numObjects }}
        </span>
        <span class="grey--text text--lighten-1 mx-2">|</span>
        <span class="headline font-weight-bold pink--text text--accent-2">
          {{ pattern.difficulty }}
        </span>
        <span class="subtitle-2 pink--text text--accent-2">/ 10</span>
        <span class="subtitle-2 ml-3">Difficulty</span>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <v-row v-if="pattern.GIF" align="center" justify="left">
        <div class="pl-3">
          <v-img :src="pattern.GIF" width="70px"></v-img>
        </div>
        <v-col>
          <span>{{ description }}</span>
        </v-col>
      </v-row>
      <v-row class="mb-0">
        <v-col class="text-right grey--text mt-5 pb-0">
          {{ pattern.numUsers }} participants
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'PatternResult',
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
.name:hover {
  color: #ff80ab !important;
}
</style>
