const express = require('express')
const route = require('./routes/route')
const cookieParser = require('cookie-parser')
const { restrictToLogin, singout } = require('./middlewares/auth')

const app = express()
const port = 10000
const ip = 'localhost'

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static('public'))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

app.set('view engine', 'ejs')

// app.get('/', restrictToLogin, route)
// app.get('/user/profile', restrictToLogin, route)
// app.get('/logout', singout, route)
// app.get('/users', route)
// app.get('/student/:sid', route)
// app.get('/users/:userId', route)
// app.post('/users', route)
// app.post('/', restrictToLogin, route)
// app.post('/users/login', route)
// app.post('/upload', restrictToLogin, route)
// app.post('/student/:sid', route)
// app.post('/student/delete/:sid', route)
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

app.listen(port, ip, err => {
  if (err) {
    console.error('Error starting server:', err)
  } else {
    console.log(`Server is running on http://${ip}:${port}`)
  }
})
