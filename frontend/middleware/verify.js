export default async function({ app, error }) {
  try {
    await app.$axios.$get('/verify')
    return
  } catch (err) {
    await app.$auth.logout()
    error({ message: err.response.data.message, statusCode: 500 })
  }
}
