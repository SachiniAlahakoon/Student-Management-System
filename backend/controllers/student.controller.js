const pool = require("../config/db");

const getStudentById = async (req, res) => {
  const { studentId } = req.params;

 // const getStudentProfile = async (req, res) => {
 // if (req.user.role !== "student") {
 //   return res.status(403).json({ message: "Not a student" });
 // }

 try {
  const [rows] = await pool.query(
    `SELECT 
      s.student_id, s.reg_no, s.name, s.address, s.birthday,
      s.admission_date, s.blood_type, s.Hcondition, s.contact1, s.contact2,
      a.current_grade, a.section, a.subjects_en FROM student_t s
    LEFT JOIN acade_info a 
      ON s.student_id = a.student_id
    WHERE s.student_id = ?`,
    [studentId]
  );

  if (!rows.length) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.json(rows[0]);
} catch (error) {
  console.error("Error fetching student profile:", error);
  res.status(500).json({ message: "Server error" });
}
};

module.exports = { getStudentById };

//module.exports = { getStudentProfile };