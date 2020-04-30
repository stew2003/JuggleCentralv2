const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()

const userRoutes = require('./routes/users')
const patternRoutes = require('./routes/patterns')
const recordRoutes = require('./routes/records')
const searchRoutes = require('./routes/search')
const feedRoutes = require('./routes/feed')
const verifyRoute = require('./routes/verify')

app.use(cors())

// get body parser ready
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// mount the routes to the server
app.use('/', userRoutes)
app.use('/', patternRoutes)
app.use('/', recordRoutes)
app.use('/', searchRoutes)
app.use('/', feedRoutes)
app.use('/', verifyRoute)

// create an error middleware!
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(err.status).send({ message: err.message.toString() })
})

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Backend api for JuggleCentral listening on ${process.env.HOST}:${process.env.PORT}`
  )
})
