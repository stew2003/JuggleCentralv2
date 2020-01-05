<template>
  <v-container fluid>
    <v-row v-for="(item, i) in feed" :key="i" justify="center">
      <v-col cols="12" md="7">
        <User v-if="item.isNewUserActivity" :user="item" />
        <JugglePattern v-if="item.isNewPatternActivity" :pattern="item" />
        <Record v-if="item.isPBActivity" :record="item" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import User from '@/components/feed/User.vue'
import JugglePattern from '@/components/feed/JugglePattern.vue'
import Record from '@/components/feed/Record.vue'

export default {
  components: {
    User,
    JugglePattern,
    Record
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
  mounted() {
    this.scroll()
  },
  methods: {
    scroll() {
      window.onscroll = () => {
        const bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight ===
          document.documentElement.offsetHeight

        if (bottomOfWindow) {
          this.loadMore()
        }
      }
    },
    async loadMore() {
      this.counter++
      this.feed = await this.$axios.$get(
        `/feed?limit=${this.itemsPerCount * this.counter}`
      )
    }
  }
}
</script>
