const { User } = require('./schema')
const { v4: uuidv4 } = require('uuid')
const { setUser, getUser } = require('../services/aouth')

function getAllUsers (req, res) {
  //   fs.readFile('users.json', 'utf8', (err, data) => {
  //     if (data) {
  //       res.json(JSON.parse(data))
  //     } else {
  //       res.end(err)
  //     }
  //   })
}

async function createUser (req, res) {
  const { first_name, last_name, email, password } = req.body

  const newCreate = await User.create({
    first_name,
    last_name,
    email,
    password
  })
  res
    .status(201)
    .send(
      `<script>alert("User Created Successfully. Id = ${newCreate._id}"); window.location.href = "http://localhost:8000/login.html";</script>`
    )
}
async function loginUser (req, res) {
  const { email, password } = req.body

  try {
    // Attempt to find the user based on email and password
    const result = await User.findOne({ email: email, password: password })

    if (!result) {
      // If user not found, handle the login failure
      return res
        .status(401)
        .send(
          `<script>alert("email or password is not correct"); window.location.href = "http://localhost:8000/login.html";</script>`
        )
    }
    const token = setUser(result)
    res.cookie('uid', token, { httpOnly: true })
    return res.redirect('/')
  } catch (error) {
    // Handle any errors that occurred during the findOne() operation or session management
    console.error('Error logging in:', error)
    return res.status(500).send('Internal server error')
  }
}

function getUserById (req, res) {
  //   const userId = req.params.userId
  //   fs.readFile('users.json', 'utf8', (err, data) => {
  //     if (data) {
  //       const users = JSON.parse(data)
  //       const user = users.find(user => user.id === parseInt(userId))
  //       if (user) {
  //         res.json(user)
  //       } else {
  //         res.status(404).end(`User with ID ${userId} not found`)
  //       }
  //     } else {
  //       res.end(err)
  //     }
  //   })
}

module.exports = { getAllUsers, getUserById, createUser, loginUser }
