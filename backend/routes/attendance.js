const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// Get all students of a class
router.get('/students/:classId', async (req, res) => {
  const { classId } = req.params;
  try {
    const [students] = await pool.query(
      'SELECT * FROM students WHERE student_id IN (SELECT student_id FROM student_attendance WHERE class_id = ?)',
      [classId]
    );
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark attendance
router.post('/mark', async (req, res) => {
  const { classId, date, attendance } = req.body;

  try {
    // 1️⃣ Check if attendance already marked for this class & date
    const [existing] = await pool.query(
      `SELECT 1 FROM student_attendance
       WHERE class_id = ? AND attendance_date = ?
       LIMIT 1`,
      [classId, date]
    );

    if (existing.length > 0) {
      return res.status(409).json({
        message: "Attendance has already been marked for today."
      });
    }

    // 2️⃣ Insert attendance (first time only)
    for (const student of attendance) {
      await pool.query(
        `INSERT INTO student_attendance
         (student_id, class_id, attendance_date, status)
         VALUES (?, ?, ?, ?)`,
        [student.student_id, classId, date, student.status]
      );
    }

    res.json({ message: "Attendance recorded successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// Get attendance report
router.get('/report/:classId', async (req, res) => {
  const { classId } = req.params;
  try {
    const [records] = await pool.query(
      'SELECT sa.attendance_date, s.student_name, sa.status FROM student_attendance sa JOIN students s ON sa.student_id = s.student_id WHERE sa.class_id = ? ORDER BY sa.attendance_date DESC',
      [classId]
    );
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch report' });
  }
});

module.exports = router;
