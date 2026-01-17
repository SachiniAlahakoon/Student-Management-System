const pool = require("../config/db");

const getAvailableYears = async (req, res) => {
  try {
    const reg_no = req.user.reg_no;

    const sql = `
      SELECT DISTINCT er.year
      FROM exam_results er
      JOIN students s ON er.student_id = s.student_id
      WHERE s.reg_no = ?
      ORDER BY er.year DESC
    `;

    const [rows] = await pool.execute(sql, [reg_no]);
    res.json(rows.map((r) => r.year));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

const getAvailableTerms = async (req, res) => {
  try {
    const reg_no = req.user.reg_no;
    const { year } = req.query;

    const sql = `
      SELECT DISTINCT er.term
      FROM exam_results er
      JOIN students s ON er.student_id = s.student_id
      WHERE s.reg_no = ? AND er.year = ?
      ORDER BY FIELD(er.term, '1st', '2nd', '3rd')
    `;

    const [rows] = await pool.execute(sql, [reg_no, year]);
    res.json(rows.map((r) => r.term));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

const getExamResults = async (req, res) => {
  try {
    const reg_no = req.user.reg_no;
    const { year, term } = req.query;

    const sql = `
      SELECT
        sub.subject_name AS subject,
        er.marks,
        er.grade
      FROM exam_results er
      JOIN students s ON er.student_id = s.student_id
      JOIN subjects sub ON er.subject_id = sub.subject_id
      WHERE s.reg_no = ?
        AND er.year = ?
        AND er.term = ?
    `;

    const [rows] = await pool.execute(sql, [reg_no, year, term]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

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
// ================= ADMIN: GET ALL STUDENTS =================
const getStudents = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    // MAIN QUERY
    const [students] = await pool.query(
      `
      SELECT
        s.reg_no,
        CONCAT(s.student_firstname, ' ', s.student_lastname) AS full_name,
        c.class_name,
        s.address,
        TIMESTAMPDIFF(YEAR, s.birthday, CURDATE()) AS age
      FROM students s
      LEFT JOIN classes c ON s.class_id = c.class_id
      WHERE
        s.student_firstname LIKE ?
        OR s.student_lastname LIKE ?
        OR s.reg_no LIKE ?
      LIMIT ? OFFSET ?
      `,
      [
        `%${search}%`,
        `%${search}%`,
        `%${search}%`,
        limit,
        offset,
      ]
    );

    // COUNT QUERY
    const [[{ total }]] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM students s
      WHERE
        s.student_firstname LIKE ?
        OR s.student_lastname LIKE ?
        OR s.reg_no LIKE ?
      `,
      [`%${search}%`, `%${search}%`, `%${search}%`]
    );

    res.json({ data: students, total });
  } catch (err) {
    console.error("Error fetching students:", err);
    res.status(500).json({ data: [], total: 0 });
  }
};


module.exports = {
  getAvailableYears,
  getAvailableTerms,
  getExamResults,
  getStudentProfile,
  getStudentById,
  getStudents, 
};