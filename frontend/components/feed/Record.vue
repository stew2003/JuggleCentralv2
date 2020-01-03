<template>
  <v-card>
    <v-card-title>
      <span class="title font-weight-light text-truncate mr-10">
        <nuxt-link :to="`/user/${record.userUID}`" class="name">
          {{ record.userName }}
        </nuxt-link>
        set a new personal best for
        <nuxt-link :to="`/pattern/${record.patternUID}`" class="name">
          {{ record.patternName }}
        </nuxt-link>
      </span>
      <v-spacer></v-spacer>
      <div>
        <span v-if="record.catches" class="subtitle-2">
          Catches : {{ record.catches }}
        </span>
        <span v-if="record.duration" class="subtitle-2">
          Duration: {{ record.duration }}
        </span>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <span>Score: {{ record.score }}</span>
      <v-spacer></v-spacer>
      <div class="text-right white--text mt-5" style="width: 100%;">
        {{ record.relativeTime }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Jugglerecord',
  props: {
    record: {
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
</style>
