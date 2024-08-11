const express = require('express')
const path = require('path');
const router = require('./routes/route')
const cookieParser = require('cookie-parser')
const checkAuth = require('./services/checkauth');
const { getAllStudent_to_Render, getStudentById_render, getStudentWithPhoto } = require('./components/studentapi');

const app = express();
const port = process.env.PORT || 2020;
// const ip = 'localhost';

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

// Serve Bootstrap CSS from node_modules
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));

app.set('view engine', 'ejs')

app.get("/login", router)
app.get("/signup", router)

app.get('/student-profile/:id', checkAuth, getStudentById_render, (req, res) => {
  const student = req.onestudent.data ? req.onestudent.data[0] : null;
  res.render('student-profile', { student });
});

app.get('/student', checkAuth, getAllStudent_to_Render,  (req, res) => {
  const studentlist = req.studentList.data;
  res.render('student', {studentlist})
})

app.post('/student-profile/:id', router)
app.post('/student-profile/delete/:id', router)

app.get('/message', checkAuth, (req, res) => {
  res.render('message')
})
app.get('/profile', checkAuth, getStudentWithPhoto,  (req, res) => {
  const studentlist = req.studentList.data;
  res.render('profile', {studentlist})
})


app.get('/syllabus', checkAuth, (req, res) => {
  res.render('syllabus')
})
app.get('/register', checkAuth, (req, res) => {
  res.render('register')
})

// api CRUD operations

app.get('/api/students', router)
app.get('/api/student/:id', router)
app.post('/api/student/register', router)
app.put('/api/student/:id', router)
app.delete('/api/student/:id', router)

// Route to upload PDF
app.post('/document', router);
app.post('/document/delete', router);

// get Excel File from student data
app.get("/get-excel-student", router)

// Route to show PDF
app.get('/document/:student_id', router);

// teacher api
app.post('/signup', router)
app.post('/login', router)
app.get("/logout", router)

// remove background
app.post('/remove-bg', router)

app.listen(port,  err => {
  if (err) {
    console.error('Error starting server:', err)
  } else {
    console.log(`Server is running on http://localhost:${port}`)
  }
})
