const pool = require("../config/db");

// Fetch student profile based on JWT user id
const getStudentProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authenticate middleware

    const [rows] = await pool.query(
      `SELECT 
         s.student_id, s.reg_no, s.student_firstname, s.student_lastname, s.address, s.birthday,
         s.admission_date, s.blood_type, s.Hcondition, s.contact1, s.contact2,
         a.current_grade, a.section, a.subjects_en
       FROM students s
       LEFT JOIN acade_info a ON s.student_id = a.student_id
       WHERE s.user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Student profile not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: admin fetching any student by ID
const getStudentById = async (req, res) => {
  const { studentId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT 
         s.student_id, s.reg_no, s.student_firstname, s.student_lastname, s.address, s.birthday,
         s.admission_date, s.blood_type, s.Hcondition, s.contact1, s.contact2,
         a.current_grade, a.section, a.subjects_en
       FROM students s
       LEFT JOIN acade_info a ON s.student_id = a.student_id
       WHERE s.student_id = ?`,
      [studentId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching student by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStudentProfile, getStudentById };
