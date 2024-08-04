const express = require('express')
const router = express.Router()
const { createUser, loginUser } = require('../models/users')

const {
  createStudent,
  getAllStudentsByAdmin,
  getStudentById,
  updateStudentById,
  deleteStudent
} = require('../models/student')
const { getFile } = require('../models/state&dist')
const { uploadUserPic, getUserImg } = require('../models/storeUserImage')

router
  .get('/', getAllStudentsByAdmin, getFile, (req, res) => {
    res.render('dashboard', {
      students: res.locals.students,
      stateList: res.locals.stateList,
      user: req.user
    })
  })
  .get('/student/:sid', getStudentById, (req, res) => {
    if (res.locals.updateStudent != null) {
      res.render('updateStudentPage', { student: res.locals.updateStudent })
    }
  })
  .post('/student/:sid', updateStudentById)

  .post('/', createStudent)

  .get('/logout', (req, res) => {
    res.redirect('/login.html')
  })
  .get('/users/login', (req, res) => {
    res.redirect('/login.html')
  })
  .get('/user/profile', getUserImg)
  .post('/users', createUser)
  .post('/users/login', loginUser)
  .post('/upload', uploadUserPic)
  .post('/student/delete/:sid', deleteStudent)

module.exports = router
