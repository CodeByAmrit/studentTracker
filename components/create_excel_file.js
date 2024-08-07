
const {getConnection} = require("../models/getConnection")
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Route to generate and download Excel file
async function create_student_excel(req, res) {
    let connection;

    try {
        connection = await getConnection();
        const sql = 'SELECT student_id, teacher_id, full_name, father_name, mother_name, email, phone_no, house_no, state, district, zip, gender, srn_no, pen_no, admission_no, class, section FROM students WHERE teacher_id = ?';
        const [rows] = await connection.execute(sql, [req.user._id]);

        if (rows.length === 0) {
            return res.status(404).send('No students found for the given teacher ID');
        }

        // Create a new workbook and add a worksheet
        const wb = xlsx.utils.book_new();
        const ws = xlsx.utils.json_to_sheet(rows);
        xlsx.utils.book_append_sheet(wb, ws, 'Students');

        // Write to a file in the server's filesystem
        const filePath = path.join(__dirname, 'students.xlsx');
        xlsx.writeFile(wb, filePath);

        // Send the file to the client
        res.download(filePath, 'students.xlsx', (err) => {
            if (err) {
                console.error('Error sending file: ', err);
                return res.status(500).send('Error sending file');
            }

            // Delete the file from the server after sending
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file: ', err);
                }
            });
        });
    } catch (error) {
        console.error('Error creating Excel file: ', error);
        res.status(500).send('Error creating Excel file');
    } finally {
        if (connection) {
            await connection.end();
        }
    }
}

module.exports  = {create_student_excel}