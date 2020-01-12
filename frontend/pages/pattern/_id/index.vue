<template>
  <v-container fluid>
    <v-row justify="center">
      <v-col cols="12" md="7">
        <v-card>
          <v-card-title class="display-2">{{ pattern.name }}</v-card-title>
          <v-divider></v-divider>
          <span>{{ pattern.description }}</span>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  async asyncData({ params, app }) {
    const pattern = await app.$axios.$get(`/pattern?uid=${params.id}`)
    return { pattern }
  }
}
</script>
