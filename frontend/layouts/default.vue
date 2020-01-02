<template>
  <v-app dark>
    <v-app-bar fixed app>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-toolbar-items>
        <v-btn
          v-for="(item, i) in items"
          :key="`button-${i}`"
          :to="item.to"
          text
        >
          <v-icon left>{{ item.icon }}</v-icon> {{ item.title }}
        </v-btn>
      </v-toolbar-items>
      <v-col cols="2">
        <v-text-field
          v-model="query"
          placeholder="search"
          prepend-inner-icon="mdi-magnify"
          hide-details
          single-line
          outlined
          dense
        ></v-text-field>
      </v-col>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer :fixed="fixed" app>
      <span>&copy; 2019</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      title: 'JuggleCentral',
      items: [
        {
          icon: 'mdi-file-document-box-search-outline',
          title: 'Browse Patterns',
          to: '/search'
        },
        {
          icon: 'mdi-podium',
          title: 'Leaderboard',
          to: '/leaderboard'
        }
      ],
      query: ''
    }
  }
}
</script>
