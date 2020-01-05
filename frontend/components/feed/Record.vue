<template>
  <v-card>
    <v-card-title>
      <span class="title text-truncate mr-10">
        <nuxt-link
          :to="`/user/${record.userUID}`"
          class="name indigo--text text--accent-1"
        >
          {{ record.userName }}
        </nuxt-link>
        set a new personal best for
        <nuxt-link
          :to="`/pattern/${record.patternUID}`"
          class="name indigo--text text--accent-1"
        >
          {{ record.patternName }}
        </nuxt-link>
      </span>
      <v-spacer></v-spacer>
      <div>
        <div v-if="record.catches">
          <span class="headline font-weight-bold indigo--text text--accent-1">
            {{ record.catches }}
          </span>
          <span class="subtitle-2 ml-3">Catches</span>
        </div>
        <div v-if="record.duration">
          <span class="headline font-weight-bold indigo--text text--accent-1">
            {{ record.duration }}
          </span>
          <span class="subtitle-2 ml-3">Duration</span>
        </div>
      </div>
    </v-card-title>
    <v-divider></v-divider>
    <v-card-text>
      <span>Now ranked {{ record.recordRank }} in this pattern.</span>
      <v-spacer></v-spacer>
      <div class="text-right grey--text mt-5" style="width: 100%;">
        {{ record.relativeTime }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script>
export default {
  name: 'Record',
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
.name:hover {
  color: #9fa8da !important;
}
</style>
