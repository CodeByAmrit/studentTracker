const express = require('express')
const {getAllStudentsByTeacherId,insertStudent,updateStudentDetails, getAllStudentsByStudentId, teacherSignup, teacherLogin} = require('../components/studentapi');
const checkAuth = require('../services/checkauth');
const router = express.Router()
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });

router.get('/api/students', checkAuth, getAllStudentsByTeacherId)
router.get('/api/student/:id', getAllStudentsByStudentId)
router.post('/api/student/:id',checkAuth, updateStudentDetails)

router.post('/api/student/register', checkAuth, upload.single('userPhoto'), insertStudent)

router.put('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})
router.delete('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})

// teaceher route
router.post('/signup', teacherSignup)
router.post('/login', teacherLogin)

router.get("/login", (req, res)=>{
  res.render("login")
})
router.get("/signup", (req, res)=>{
  res.render("signup")
})

module.exports = router
