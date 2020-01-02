const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const userRoutes = require('./routes/users')
const patternRoutes = require('./routes/patterns')
const recordRoutes = require('./routes/records')

app.use(cors())

// get body parser ready
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use('/', userRoutes)
app.use('/', patternRoutes)
app.use('/', recordRoutes)

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
