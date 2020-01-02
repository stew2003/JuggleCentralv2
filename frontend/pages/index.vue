<template>
  <v-container fluid>
    <v-row v-for="(item, i) in feed" :key="i" justify="center">
      <v-col cols="12" md="7">
        <User v-if="item.isNewUserActivity" :user="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import User from '@/components/feed/User.vue'

export default {
  components: {
    User
  },
  async asyncData({ app, error }) {
    try {
      const counter = 1
      const itemsPerCount = 30

      const feed = await app.$axios.$get(
        `/feed?limit=${itemsPerCount * counter}`
      )

      return {
        counter,
        itemsPerCount,
        feed
      }
    } catch (err) {
      error(err)
    }
  },
  methods: {
    async update() {
      this.counter++
      this.feed = await this.$axios.$get(
        `/feed?limit=${this.itemsPerCount * this.counter}`
      )
    }
  }
}
</script>
