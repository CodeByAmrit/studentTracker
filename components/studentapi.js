const bcrypt = require('bcrypt');
const  { setUser } = require("../services/aouth")
const { getConnection } = require('../models/getConnection');

const saltRounds = 10;

async function getAllStudentsByTeacherId(req, res) {
  let connection;
  let teacherId = req.user._id;
  
  
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT student_id, teacher_id, full_name, father_name, mother_name, email, phone_no, house_no, state, district, zip, gender, srn_no, pen_no, admission_no, class, section FROM students WHERE teacher_id = ?',
      [teacherId]
    );
    return res.json({data: rows});
  } catch (error) {
    console.error(error, "SEND JSON");
    res.json({data: "Fail to get students"})
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllStudent_to_Render(req, res, next) {
  let connection;
  let teacherId = req.user._id;
  
  
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT student_id, teacher_id, full_name, father_name, mother_name, email, phone_no, house_no, state, district, zip, gender, srn_no, pen_no, admission_no, class, section FROM students WHERE teacher_id = ?',
      [teacherId]
    );
    req.studentList = {data: rows};
    next()
  } catch (error) {
    console.error(error, "SEND JSON");
    req.studentList = undefined;
    next()
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getStudentWithPhoto(req, res, next) {
  let connection;
  let teacherId = req.user._id;

  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM students WHERE teacher_id = ?',
      [teacherId]
    );

    // Convert photo BLOBs to Base64 strings
    const students = rows.map(student => {
      if (student.photo) {
        student.photo = Buffer.from(student.photo, 'binary').toString('base64');
      }
      return student;
    });

    req.studentList = { data: students };
    next();
  } catch (error) {
    console.error(error, "SEND JSON");
    req.studentList = undefined;
    next();
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getAllStudentsByStudentId(req, res) {
  let connection;
  let studentId = req.params.id;
  
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT student_id, teacher_id, full_name, father_name, mother_name, email, phone_no, house_no, state, district, zip, gender, srn_no, pen_no, admission_no, class, section FROM students WHERE student_id = ?',
      [studentId]
    );
    return res.json({data: rows});
  } catch (error) {
    console.error(error, "SEND JSON");
    res.json({data: "Fail to get students"})
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
async function getStudentById_render(req, res, next) {
  
  let connection;
  let studentId = req.params.id;
  
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT student_id, teacher_id, full_name, father_name, mother_name, email, phone_no, house_no, state, district, zip, gender, srn_no, pen_no, admission_no, class, section, photo FROM students WHERE student_id = ?',
      [studentId]
    );
    // Convert photo BLOBs to Base64 strings
    const students = rows.map(student => {
      if (student.photo) {
        student.photo = Buffer.from(student.photo, 'binary').toString('base64');
      }
      return student;
    });
     
    // console.log({data:students});
    
    
    req.onestudent = {data:students}
    next()    
  } catch (error) {
    console.error(error, "SEND JSON");
    req.onestudent = null
    next() 
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function insertStudent(req, res) {
  const {
    name,
    father_name,
    mother_name,
    email,
    password,
    phoneNo,
    houseNo,
    state,
    district,
    zip,
    gender,
    srn_no,
    pen_no,
    admission_no,
    school_class,
    section
  } = req.body;
  
  // Assign default value to userPhoto if not provided
  const userPhoto = req.file ? req.file.buffer : null;

  // Check if req.user.id is available
  const teacherId = req.user._id ;
  

  // Ensure all required fields are defined
  if (!teacherId || !name || !father_name || !mother_name || !email || !password || !phoneNo || !houseNo || !state || !district || !zip || !gender || !srn_no || !pen_no || !admission_no || !school_class || !section) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let connection;
  try {
    connection = await getConnection();

    // Hash the student's password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert the new student into the database
    const [result] = await connection.execute(
      `INSERT INTO students (
        teacher_id, full_name, father_name, mother_name, email, password, phone_no, house_no, state, district, zip, gender, srn_no, pen_no, admission_no, class, section, photo
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        teacherId, name, father_name, mother_name, email, hashedPassword, phoneNo, houseNo, state, district, zip, gender, srn_no, pen_no, admission_no, school_class, section, userPhoto
      ]
    );

    res.status(201).json({ message: 'Student created successfully', studentId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.sqlMessage });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function deleteStudent(req, res) {
  // Check if req.user.id is available
  const studentId = req.params.id;
  
  // Ensure all required fields are defined
  if (!studentId ) {
    return res.status(400).json({ message: 'Student ID required' });
  }

  let connection;
  try {
    connection = await getConnection();

    try {
      await connection.execute(`DELETE from studentDocument where student_id = ?`,[studentId,]);
    } catch (error) {
      console.log("studentDocument", error);
    }

    // Insert the new student into the database
    const [result] = await connection.execute(`DELETE from students where student_id = ?`,[studentId,]);
    
    res.status(200).json({ message: 'Student Deleted successfully', studentId: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.sqlMessage });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}
async function deletePDF(req, res) {
  // Check if req.user.id is available
  const studentId = req.params.id;
  
  // Ensure all required fields are defined
  if (!studentId ) {
    return res.status(400).json({ message: 'Student ID required' });
  }

  let connection;
  try {
    connection = await getConnection();

    await connection.execute(`DELETE from studentDocument where student_id = ?`,[studentId,]);
    
    res.status(201).json({ message: 'PDF Deleted successfully', studentId: result});
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.sqlMessage });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}


async function teacherSignup(req, res) {
  const {firstName, lastName, email, password} = req.body;
  let connection;
  try {
    connection = await getConnection();
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const [result] = await connection.execute(
      'INSERT INTO teacher (first_name, last_name, email, password) VALUES (?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword]
    );
    res.redirect("/login") ; // Return the new teacher's ID
  } catch (error) {
    // console.error(error);
    res.json({status: error.sqlMessage});
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function teacherLogin(req, res) {
  let {email, password} = req.body;
  let connection;
  try {
    connection = await getConnection();
    const [rows] = await connection.execute(
      'SELECT * FROM teacher WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.json({status:'Invalid email'});
    }
    const teacher = rows[0];
    const passwordMatch = await bcrypt.compare(password, teacher.password);
    if (!passwordMatch) {
      return res.json({status:'Invalid email'});
    }
    // res.removeHeader(Authorization)
    const payload = {
      id: teacher.id,
      first_name: teacher.first_name,
      last_name: teacher.last_name,
      email: teacher.email,
    }; // Return the logged-in teacher's details

    const token = setUser(payload);
    res.cookie('token', token, {
      httpOnly: true,
      secure: true, // Set to true if using https
      sameSite: 'Strict'
    });
    res.redirect("/profile")
    
    
  } catch (error) {
    res.json({status: error.sqlMessage});
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function updateStudentDetails(req, res) {
  // Helper function to replace undefined with null
  const sanitize = value => value === undefined ? null : value;
  let connection;
  let studentId = req.params.id;
  // console.log(studentId);
  
  const {
    full_name,
    father_name,
    mother_name,
    email,
    phone_no,
    house_no,
    state,
    district,
    zip,
    gender,
    srn_no,
    pen_no,
    admission_no,
    studentClass,
    section
  } = req.body;

  // console.log("body", req.body);

  const studentPhoto =  req.file ? req.file.buffer : null;
  
  // Ensure all required fields are defined
  if (!studentId || !full_name || !father_name || !mother_name || !email  || !phone_no || !house_no || !state || !district || !zip || !gender || !srn_no || !pen_no || !admission_no || !studentClass || !section) {
    return res.status(400).json({ message: 'All fields are required' });
  }


  try {
    connection = await getConnection();
    if (studentPhoto != null) {
      const [result] = await connection.execute(
        `UPDATE students 
         SET full_name = ?, father_name = ?, mother_name = ?, email = ?, phone_no = ?, house_no = ?, state = ?, district = ?, zip = ?, gender = ?, srn_no = ?, pen_no = ?, admission_no = ?, class = ?, section = ?, photo = ?
         WHERE student_id = ?`,
        [
          sanitize(full_name),
          sanitize(father_name),
          sanitize(mother_name),
          sanitize(email),
          sanitize(phone_no),
          sanitize(house_no),
          sanitize(state),
          sanitize(district),
          sanitize(zip),
          sanitize(gender),
          sanitize(srn_no),
          sanitize(pen_no),
          sanitize(admission_no),
          sanitize(studentClass),
          sanitize(section),
          studentPhoto,
          studentId
        ]
      );
    }else{
      const [result] = await connection.execute(
        `UPDATE students 
         SET full_name = ?, father_name = ?, mother_name = ?, email = ?, phone_no = ?, house_no = ?, state = ?, district = ?, zip = ?, gender = ?, srn_no = ?, pen_no = ?, admission_no = ?, class = ?, section = ?
         WHERE student_id = ?`,
        [
          sanitize(full_name),
          sanitize(father_name),
          sanitize(mother_name),
          sanitize(email),
          sanitize(phone_no),
          sanitize(house_no),
          sanitize(state),
          sanitize(district),
          sanitize(zip),
          sanitize(gender),
          sanitize(srn_no),
          sanitize(pen_no),
          sanitize(admission_no),
          sanitize(studentClass),
          sanitize(section),
          studentId
        ]
      );
    }
    return res.status(200).send(`<script>alert('Sutdent data Updated Sucessfully'); window.location.href = '/profile';</script>`);
  } catch (error) {
    console.error(error, "UPDATE ERROR");
    res.json({ message: error.sqlMessage });
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

async function getPdfWithPDF(req, res) {
  let connection;
  
  const student_id = req.params.student_id;
  try{
    connection = await getConnection();

    const sql = 'SELECT document FROM studentDocument WHERE student_id = ?';
    const [results] = await connection.execute(sql, [student_id]);
    if (results.length > 0) {
      const document = results[0].document;
      res.contentType('application/pdf');
      res.send(document);
    } else {
      res.status(404).send('Document not found');
    }
  }catch (error){
    console.log(error);
    
  }
    
}

async function insertPDF(req, res) {
  let connection ;
  const student_id = req.body.student_id;
  const pdf_from_body = req.file.buffer;
  if (!pdf_from_body || !student_id) {
    console.log("No PDF file or student_id");
  }
  console.log("insert pdf runs");
  

  try {
    connection = await getConnection();
    const sql = 'INSERT INTO studentDocument (student_id, document) VALUES (?, ?)';
    const [result] = await connection.execute(sql, [student_id, pdf_from_body]);

    res.status(200).json({result:'Document uploaded successfully'});
  } catch (error) {
    console.log(error);
    
    res.json({ message: error });
  }finally {
    if (connection) {
      await connection.end();
      console.log("disconnect");
      
    }
  }
}


module.exports = {
  getAllStudentsByTeacherId,
  getStudentWithPhoto,
  updateStudentDetails,
  getAllStudent_to_Render,
  getAllStudentsByStudentId,
  teacherSignup,
  teacherLogin,
  insertPDF,
  getPdfWithPDF,
  insertStudent,
  deleteStudent,
  getStudentById_render,
  deletePDF
}
