const { Student } = require('./schema')

const getAllStudentsByAdmin = async (req, res, next) => {
  try {
    const students = await Student.find({ admin_id: req.user._id })

    res.locals.students = students
    next()
  } catch (error) {
    // Handle errors
    console.error('Error in getAllStudentsByAdmin:', error)
    res.status(500).send('Internal Server Error')
  }
}

async function createStudent (req, res) {
  const admin_id = req.user._id
  const {
    first_name,
    last_name,
    roll_no,
    state,
    district,
    house_no,
    semester,
    group,
    add_type,
    email,
    student_phone,
    parent_phone
  } = req.body

  const newCreate = await Student.create({
    admin_id,
    first_name,
    last_name,
    roll_no,
    state,
    district,
    house_no,
    semester,
    group,
    add_type,
    email,
    student_phone,
    parent_phone
  })
  res
    .status(201)
    .send(
      `<script>alert("Student Added. Id = ${newCreate._id}"); window.location.href = "http://localhost:8000/";</script>`
    )
}

async function getStudentById (req, res, next) {
  const studentId = req.params.sid
  try {
    const oneStudent = await Student.findOne({ _id: studentId })
    res.locals.updateStudent = oneStudent
    next()
  } catch (error) {
    res.locals.updateStudent = null
    next()
  }
}
async function deleteStudent (req, res) {
  const studentId = req.params.sid
  try {
    const std = await Student.deleteOne({ _id: studentId })
    res.locals.deleteStudent = std
    res
      .status(201)
      .send(
        `<script>alert("Student deleted successfully"); window.location.href = "/";</script>`
      )
  } catch (error) {
    console.log(error)
  }
}

async function updateStudentById (req, res) {
  const studentId = req.params.sid
  const updatedData = req.body
  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { _id: studentId },
      updatedData,
      { new: true } // Return the updated document
    )

    if (!updatedStudent) {
      return res.status(404).send('Student not found')
    }

    res.status(200).redirect('/')
  } catch (error) {
    res.status(500).send('Error updating student')
  }
}

module.exports = {
  createStudent,
  getAllStudentsByAdmin,
  getStudentById,
  updateStudentById,
  deleteStudent
}
