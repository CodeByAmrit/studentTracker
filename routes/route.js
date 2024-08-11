const express = require('express')
const { getAllStudentsByTeacherId, insertPDF, getPdfWithPDF, insertStudent, deletePDF, deleteStudent, updateStudentDetails, getAllStudentsByStudentId, teacherSignup, teacherLogin } = require('../components/studentapi');
const checkAuth = require('../services/checkauth');
const { create_student_excel } = require("../components/create_excel_file")
// const {removeBg} = require('../services/removebg');
const router = express.Router()
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() });
// const bg_remove_folder= multer({ dest: 'uploads/' });

router.get('/api/students', checkAuth, getAllStudentsByTeacherId)
router.get('/api/student/:id', getAllStudentsByStudentId)
// router.post('/api/student/:id',checkAuth, updateStudentDetails)

router.post('/api/student/register', checkAuth, upload.single('userPhoto'), insertStudent)

// create pdf file to store documents 
router.post('/document', upload.single('document'), insertPDF);
router.post('/document/delete', deletePDF);

// show PDF from database
router.get('/document/:student_id', checkAuth, getPdfWithPDF);

// create excel file student
router.get("/get-excel-student", checkAuth, create_student_excel);

router.put('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})
router.post('/student-profile/:id', checkAuth, upload.single('userPhoto'), updateStudentDetails)

// delete student record
router.post('/student-profile/delete/:id', checkAuth, deleteStudent)

router.delete('/api/student/:id', (req, res) => {
  res.json({ status: `/student/:id  ${req.params.id}` })
})

// teaceher route
router.post('/signup', teacherSignup)
router.post('/login', teacherLogin)

router.get("/login", (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    res.render("login")
  }
  else {
    res.redirect("/profile")
  }
})
router.get("/logout", logoutUser)
router.get("/signup", (req, res) => {
  res.render("signup")
})


function logoutUser(req, res) {
  res.clearCookie("token").redirect("/login")
}
module.exports = router
