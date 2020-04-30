export default async function({ app, error }) {
  try {
    await app.$axios.$get('/verify')
    return
  } catch (err) {
    await app.$auth.logout()
    error(err.response.data.message)
  }
}
