const express = require('express')
const verify = require('../middleware/verify')

const router = express.Router()

router.get('/verify', verify, async (req, res) => {
  res.send({ success: true })
})

module.exports = router
