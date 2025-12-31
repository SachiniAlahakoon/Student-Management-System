const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Get classes for a teacher
router.get("/classes/:teacherId", async (req, res) => {
  const { teacherId } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT class_id, class_name FROM classes WHERE teacher_id = ?",
      [teacherId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
});

// Get subjects for a teacher in a specific class
router.get("/subjects/:teacherId/:classId", async (req, res) => {
  const { teacherId, classId } = req.params;
  try {
    const [rows] = await db.query(
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
});

module.exports = router;
