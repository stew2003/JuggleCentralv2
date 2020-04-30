<template>
  <h1>You are being logged in!</h1>
</template>

<script>
export default {
  middleware: ['auth'],
  async mounted() {
    try {
      await this.$axios.$get('/verify')
      this.$router.push('/')
    } catch (err) {
      this.$nuxt.error(err.response.data.message)
    }
  }
}
</script>

<style></style>
