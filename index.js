const express = require('express')
const path = require('path');
const router = require('./routes/route')
const cookieParser = require('cookie-parser')
const checkAuth = require('./services/checkauth');
const { getAllStudent_to_Render, getStudentById_render, getStudentWithPhoto } = require('./components/studentapi');

const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const helmetCsp = require('helmet-csp');
const port = process.env.PORT || 2020;
// const ip = 'localhost';

const app = express();
app.disable('x-powered-by');

// Define the rate limiter
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 80, // Limit each IP to 80 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  headers: true, // Include rate limit info in headers
});

// Apply the rate limiter to all requests and https security helmets
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", "data:"], // Allow base64 data URLs
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      frameSrc: ["'none'"]
    }
  }
}));
app.use(limiter);


// Define a custom CSP policy with helmet-csp
app.use(helmetCsp({
  directives: {
    defaultSrc: ["'self'"],
    scriptSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://code.jquery.com",
      "https://cdnjs.cloudflare.com",
      "https://stackpath.bootstrapcdn.com"
    ],
    styleSrc: [
      "'self'",
      "'unsafe-inline'",
      "https://stackpath.bootstrapcdn.com",
      "https://cdnjs.cloudflare.com",
      "https://fonts.googleapis.com"
    ],
    imgSrc: ["'self'", "data:", "https://maxcdn.bootstrapcdn.com", "https://cdn.lineicons.com/4.0/lineicons.css"],
    connectSrc: ["'self'"],
    fontSrc: [
      "'self'",
      "https://fonts.gstatic.com",
      "https://cdnjs.cloudflare.com",
      "https://maxcdn.bootstrapcdn.com"
    ],
    frameSrc: ["'none'"],
    objectSrc: ["'none'"],
    upgradeInsecureRequests: [],
  },
}));

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use('/uploads', express.static('uploads'))
app.use(cookieParser())

// Serve Bootstrap CSS from node_modules
app.use('/css', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js')));
app.use(express.static(path.join(__dirname, 'public')))

app.set('view engine', 'ejs')

app.get("/login", router)
app.get("/signup", router)

app.get('/student-profile/:id', checkAuth, getStudentById_render, (req, res, next) => {
  const student = req.onestudent.data ? req.onestudent.data[0] : null;
  res.render('student-profile', { student });
});

app.get('/student', checkAuth, getAllStudent_to_Render, (req, res, next) => {
  const studentlist = req.studentList.data;
  res.render('student', { studentlist })
})

app.post('/student-profile/:id', router)
app.post('/student-profile/delete/:id', router)

app.get('/message', checkAuth, (req, res, next) => {
  res.render('message')
})
app.get('/profile', checkAuth, getStudentWithPhoto, (req, res, next) => {
  const studentlist = req.studentList.data;
  res.render('profile', { studentlist })
})


app.get('/syllabus', checkAuth, (req, res, next) => {
  res.render('syllabus')
})
app.get('/register', checkAuth, (req, res, next) => {
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

app.listen(port, err => {
  if (err) {
    console.error('Error starting server:', err)
  } else {
    console.log(`Server is running on http://localhost:${port}`)
  }
})
