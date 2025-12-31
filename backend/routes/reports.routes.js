const express = require("express");
const router = express.Router();
const db = require("../config/db");

/* GET Class report */
router.get("/class-wise", async (req, res) => {
  const { class_id, subject_id, term, year } = req.query;

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT 
        s.student_id,
        s.student_name,
        COALESCE(er.marks, 'Not Entered') AS marks,
        COALESCE(er.grade, '-') AS grade
    FROM exam_results er
    JOIN students s ON er.student_id = s.student_id
    WHERE er.class_id = ?
        AND er.subject_id = ?
        AND er.term = ?
        AND er.year = ?
    ORDER BY s.student_name;

      `,
      [class_id, subject_id, term, year]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate class report" });
  }
});

router.get("/years", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT year FROM exam_results ORDER BY year DESC`
    );
    const years = rows.map((r) => r.year);
    res.json(years);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
});

module.exports = router;
