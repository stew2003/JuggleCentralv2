const express = require('express')
const cors = require('cors')

const app = express()

const userRoutes = require('./routes/users')

app.use(cors())

app.use('/', userRoutes)

// create an error middleware!
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(err)
  res.status(err.status).send({ error: err, message: err.message })
})

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Backend api for JuggleCentral listening on ${process.env.HOST}:${process.env.PORT}`
  )
})
