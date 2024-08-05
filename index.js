const express = require('express')
const router = require('./routes/route')
const cookieParser = require('cookie-parser')

const app = express()
const port = 10000
const ip = 'localhost'

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

app.set('view engine', 'ejs')

app.get('/edit-student', (req, res) => {
  res.render('edit-student')
})
app.get('/message', (req, res) => {
  res.render('message')
})
app.get('/profile', (req, res) => {
  res.render('profile')
})
app.get('/student', (req, res) => {
  res.render('student')
})
app.get('/syllabus', (req, res) => {
  res.render('syllabus')
})
app.get('/register', (req, res) => {
  res.render('register')
})

// api CRUD operations

app.get('/api/students', router)
app.get('/api/student/:id', router)
app.post('/api/student/:id', router)
app.put('/api/student/:id', router)
app.delete('/api/student/:id', router)

app.listen(port, ip, err => {
  if (err) {
    console.error('Error starting server:', err)
  } else {
    console.log(`Server is running on http://${ip}:${port}`)
  }
})
