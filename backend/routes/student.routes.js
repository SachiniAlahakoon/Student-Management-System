const express = require("express");
const router = express.Router();
const db = require("../config/db");

const {
  getAvailableYears,
  getAvailableTerms,
  getExamResults,
} = require("../controllers/student.controller");

router.get("/years", getAvailableYears);
router.get("/terms", getAvailableTerms);
router.get("/exam-results", getExamResults);

router.get("/class/:classId", async (req, res) => {
  const classId = req.params.classId;
  try {
    const [rows] = await db.query(
      "SELECT student_id, student_name FROM students WHERE student_id IN (SELECT student_id FROM exam_results WHERE class_id = ? GROUP BY student_id)",
      [classId]
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch students" });
  }
});

module.exports = router;
