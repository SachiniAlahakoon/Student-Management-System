const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Add or update marks
router.post("/add", async (req, res) => {
  const { class_id, subject_id, term, marks } = req.body;
  if (!class_id || !subject_id || !term || !marks) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    const promises = marks.map((m) =>
      db.query(
        `INSERT INTO exam_results (student_id, subject_id, class_id, term, year, marks)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE marks = VALUES(marks)`,
        [m.student_id, subject_id, class_id, term, m.year, m.marks]
      )
    );

    await Promise.all(promises);
    res.json({ message: "Marks submitted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to submit marks" });
  }
});

// Reset marks for a class, subject, term
router.post("/delete", async (req, res) => {
  const { class_id, subject_id, term } = req.body;

  if (!class_id || !subject_id || !term) {
    return res.status(400).json({ error: "Missing data" });
  }

  try {
    await db.query(
      `UPDATE exam_results
       SET marks = NULL, grade = NULL
       WHERE class_id = ? AND subject_id = ? AND term = ?`,
      [class_id, subject_id, term]
    );

    res.json({ message: "Marks deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete marks" });
  }
});


// Get all students in a class with marks
router.get("/:classId/:subjectId/:term", async (req, res) => {
  const { classId, subjectId, term } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT s.student_id, s.student_name, er.marks
       FROM students s
       LEFT JOIN exam_results er
         ON s.student_id = er.student_id
         AND er.class_id = ?
         AND er.subject_id = ?
         AND er.term = ?`,
      [classId, subjectId, term]
    );

    const studentsWithMarks = rows.map((s) => ({
      ...s,
      marks: s.marks ?? "", // if null, set empty string
      isNA: s.marks === null, // mark as N/A if null
    }));

    res.json(studentsWithMarks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students with marks" });
  }
});

module.exports = router;
