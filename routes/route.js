const express = require('express')
const router = express.Router()

router.get('/api/students', (req, res) => {
  res.json({ status: "/students', (req" })
})
router.get('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})
router.post('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})
router.put('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})
router.delete('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})

module.exports = router
