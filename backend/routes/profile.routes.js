/*const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { getStudentById } = require("../controllers/student.controller");
const { getTeacherById } = require("../controllers/teacher.controller");
const pool = require("../config/db");

router.get("/me", authenticate, async (req, res) => {
  const { role, user_id } = req.user;

  try {
    // STUDENT PROFILE
    if (role === "student") {
      const [rows] = await pool.query(
        "SELECT student_id FROM students WHERE user_id = ?",
        [user_id]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      req.params.studentId = rows[0].student_id;
      return getStudentById(req, res);
    }

    // TEACHER PROFILE
    if (role === "teacher") {
      const [rows] = await pool.query(
        "SELECT teacher_id FROM teachers WHERE user_id = ?",
        [user_id]
      );

      if (!rows.length) {
        return res.status(404).json({ message: "Teacher profile not found" });
      }

      req.params.teacherId = rows[0].teacher_id;
      return getTeacherById(req, res);
    }

    return res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Profile route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;*/
