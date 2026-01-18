const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    if (req.user.role !== "teacher") {
      return next();
    }

    if (req.method === "GET") {
      return next(); // allow viewing
    }

    const userId = req.user.id;
    const class_id = req.query.class_id || req.body.class_id;
    const subject_id = req.query.subject_id || req.body.subject_id;

    if (!class_id || !subject_id) {
      return res.status(400).json({
        message: "class_id and subject_id are required",
      });
    }

    const [teacherRows] = await pool.query(
      `SELECT teacher_id FROM teachers WHERE user_id = ?`,
      [userId]
    );

    if (teacherRows.length === 0) {
      return res.status(403).json({
        message: "Teacher profile not found for this user",
      });
    }

    const teacherId = teacherRows[0].teacher_id;

    const [assignmentRows] = await pool.query(
      `SELECT 1
       FROM teacher_subjects
       WHERE teacher_id = ?
         AND class_id = ?
         AND subject_id = ?`,
      [teacherId, class_id, subject_id]
    );

    if (assignmentRows.length === 0) {
      return res.status(403).json({
        message: "You are not assigned to this class and subject",
      });
    }

    next();
  } catch (err) {
    console.error("isTeacherAssigned error:", err);
    res.status(500).json({ message: "Authorization failed" });
  }
};
