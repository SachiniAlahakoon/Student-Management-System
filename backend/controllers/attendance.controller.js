const db = require("../config/db");

exports.getAttendance = async (req, res) => {
  try {
    const { regNo, view } = req.params;
    const { year, month } = req.query;

    if (view === "month") {
      if (!year || !month) {
        return res.status(400).json({ error: "Year and month required" });
      }
    } else if (view === "year") {
      if (!year) {
        return res.status(400).json({ error: "Year required" });
      }
    } else if (view !== "week") {
      return res.status(400).json({ error: "Invalid view type" });
    }

    let sql = `
      SELECT DATE(a.attendance_date) AS date, a.status
      FROM student_attendance a
      JOIN students s ON a.student_id = s.student_id
      WHERE s.reg_no = ?
    `;
    const params = [regNo];

    if (view === "week") {
      sql += " AND a.attendance_date >= CURDATE() - INTERVAL 7 DAY";
    } else if (view === "month") {
      sql += " AND YEAR(a.attendance_date) = ? AND MONTH(a.attendance_date) = ?";
      params.push(year, month);
    } else if (view === "year") {
      sql += " AND YEAR(a.attendance_date) = ?";
      params.push(year);
    }

    sql += " ORDER BY a.attendance_date DESC";

    const [rows] = await db.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error("Attendance fetch error:", err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};