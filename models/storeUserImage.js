const multer = require('multer')
const path = require('path')
const { User } = require('./schema')

// Set storage engine
const storage = multer.diskStorage({
  destination: './uploads/',
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + '-' + Date.now() + path.extname(file.originalname)
    )
  }
})

// Initialize upload variable
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 }, // Limit file size to 1MB
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb)
  }
}).single('profilePicture')

// Check file type
function checkFileType (file, cb) {
  const filetypes = /jpeg|jpg|png|gif/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)

  if (mimetype && extname) {
    return cb(null, true)
  } else {
    cb('Error: Images Only!')
  }
}

function uploadUserPic (req, res) {
  const userId = req.user._id

  upload(req, res, err => {
    if (err) {
      res.send(err)
    } else {
      if (req.file == undefined) {
        res.send('Error: No File Selected!')
      } else {
        // Update the user's profile picture in the database
        User.findByIdAndUpdate(
          userId,
          { profilePicture: req.file.path },
          { new: true }
        )
          .then(user =>
            res.send(`File uploaded and user updated: ${user.first_name}`)
          )
          .catch(err => res.send(`Error updating user: ${err}`))
      }
    }
  })
}

function getUserImg (req, res) {
  const userId = req.user._id

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send('User not found')
      }
      res.json({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        profilePicture: user.profilePicture ? `/${user.profilePicture}` : null
      })
    })
    .catch(err => res.status(500).send(`Error retrieving user: ${err}`))
}

module.exports = { uploadUserPic, getUserImg }
