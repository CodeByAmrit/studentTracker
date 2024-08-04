const mongoose = require('mongoose')

// Replace <password> with your actual MongoDB password
const url = 'mongodb://localhost:27017/students'

// Connect to MongoDB
mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err)
  })

// Define the schema - USERS
const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String }
  },
  { timestamps: true }
)

// Define the schema - STUDENTS
const studentSchema = new mongoose.Schema(
  {
    admin_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    first_name: { type: String, required: true },
    last_name: { type: String },
    roll_no: { type: Number, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    house_no: { type: String, required: true },
    semester: { type: String },
    group: { type: String },
    add_type: { type: String },
    email: { type: String, required: true, unique: true },
    student_phone: { type: Number },
    parent_phone: { type: Number, required: true }
  },
  { timestamps: true }
)

// Create models based on the schemas
const User = mongoose.model('User', userSchema)
const Student = mongoose.model('Student', studentSchema)

// Export the models
module.exports = { User, Student }
