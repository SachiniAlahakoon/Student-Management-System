// routes/attendance.js
const express = require("express");
const router = express.Router();
const db = require("../config/db"); // your mysql2/promise db connection

// GET attendance for a student by view type
router.get("/:regNo/:view", async (req, res) => {
  const { regNo, view } = req.params;
  const { year, month } = req.query; // optional query for month/year views

  // Base SQL: only DATE part, not timestamp
  let sql = `
    SELECT DATE(a.attendance_date) AS date, a.status
    FROM student_attendance a
    JOIN students s ON a.student_id = s.student_id
    WHERE s.reg_no = ?
  `;
  const params = [regNo];

  // Add filters based on view type
  if (view === "week") {
    sql += " AND a.attendance_date >= CURDATE() - INTERVAL 7 DAY";
  } else if (view === "month") {
    if (!year || !month) return res.status(400).json({ error: "Month and year required" });
    sql += " AND YEAR(a.attendance_date) = ? AND MONTH(a.attendance_date) = ?";
    params.push(year, month);
  } else if (view === "year") {
    if (!year) return res.status(400).json({ error: "Year required" });
    sql += " AND YEAR(a.attendance_date) = ?";
    params.push(year);
  } else {
    return res.status(400).json({ error: "Invalid view type" });
  }

  sql += " ORDER BY a.attendance_date DESC";

  try {
    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Attendance fetch error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
});

module.exports = router;
