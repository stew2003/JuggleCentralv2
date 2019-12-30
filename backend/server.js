const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())

app.get('/', (req, res) => {
  res.send('Hello')
})

app.listen(process.env.PORT, process.env.HOST, () => {
  console.log(
    `Backend api for JuggleCentral listening on ${process.env.HOST}:${process.env.PORT}`
  )
})
