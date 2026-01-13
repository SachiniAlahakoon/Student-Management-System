const pool = require("../config/db");

exports.getClassesForTeacher = async (req, res) => {
  const teacherId = req.user.id;
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT c.class_id, c.class_name 
       FROM classes c
       JOIN teacher_subjects ts ON ts.class_id = c.class_id
       WHERE ts.teacher_id = ?`,
      [teacherId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

exports.getSubjectsForTeacherClass = async (req, res) => {
  const teacherId = req.user.id;
  const { classId } = req.params;
  try {
    const [rows] = await pool.query(
      `SELECT sub.subject_id, sub.subject_name
       FROM teacher_subjects ts
       JOIN subjects sub ON ts.subject_id = sub.subject_id
       WHERE ts.teacher_id = ? AND ts.class_id = ?`,
      [teacherId, classId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};
