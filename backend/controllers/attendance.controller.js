const pool = require("../config/db");

/* ===============================
   GET STUDENTS OF A CLASS
================================ */
const getStudents = async (req, res) => {
  try {
    const [students] = await pool.query(
      "SELECT * FROM students WHERE class_id = ?",
      [req.params.classId]
    );
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   MARK ATTENDANCE
================================ */
const markAttendance = async (req, res) => {
  const { classId, date, attendance } = req.body;

  try {
    const [existing] = await pool.query(
      "SELECT 1 FROM student_attendance WHERE class_id = ? AND attendance_date = ?",
      [classId, date]
    );

    if (existing.length) {
      return res.status(409).json({ message: "Already marked" });
    }

    for (const student of attendance) {
      await pool.query(
        `INSERT INTO student_attendance
         (student_id, class_id, attendance_date, status)
         VALUES (?, ?, ?, ?)`,
        [student.student_id, classId, date, student.status]
      );
    }

    res.json({ message: "Attendance saved" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

/* ===============================
   ATTENDANCE REPORT
================================ */
const getReport = async (req, res) => {
  const { classId } = req.params;
  const { period = "daily" } = req.query;

  let groupBy;
  let selectDate;

  switch (period) {
    case "weekly":
      groupBy = "YEAR(attendance_date), WEEK(attendance_date)";
      selectDate = "MIN(attendance_date) AS date";
      break;
    case "monthly":
      groupBy = "YEAR(attendance_date), MONTH(attendance_date)";
      selectDate = "MIN(attendance_date) AS date";
      break;
    case "yearly":
      groupBy = "YEAR(attendance_date)";
      selectDate = "MIN(attendance_date) AS date";
      break;
    default:
      groupBy = "attendance_date";
      selectDate = "attendance_date AS date";
  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        ${selectDate},
        status,
        COUNT(*) AS count
      FROM student_attendance
      WHERE class_id = ?
      GROUP BY ${groupBy}, status
      ORDER BY date DESC
      `,
      [classId]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load report" });
  }
};

module.exports = {
  getStudents,
  markAttendance,
  getReport,
};
