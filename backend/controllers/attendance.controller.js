const pool = require("../config/db");
const moment = require("moment");
require("moment/locale/en-gb");

const getAttendance = async (req, res) => {
  try {
    const { view } = req.params;
    const { year, month, week, page = 0, limit = 10 } = req.query;

    const offset = Number(page) * Number(limit);

    const regNo = req.user.reg_no;
    if (!regNo) return res.status(403).json({ error: "Unauthorized" });

    let baseSql = `
      FROM student_attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE s.reg_no = ?
    `;
    const params = [regNo];

    if (view === "year") {
      baseSql += " AND YEAR(a.attendance_date) = ?";
      params.push(year);
    } else if (view === "month") {
      baseSql +=
        " AND YEAR(a.attendance_date) = ? AND MONTH(a.attendance_date) = ?";
      params.push(year, month);
    } else if (view === "week") {
      const monthStart = moment(`${year}-${month}-01`);
      const monthEnd = monthStart.clone().endOf("month");

      const firstWeekStart = monthStart.clone().startOf("isoWeek");
      const weekStart = firstWeekStart.clone().add(week - 1, "weeks");
      const weekEnd = weekStart.clone().add(6, "days");

      const start = weekStart.isBefore(monthStart)
        ? monthStart.clone()
        : weekStart.clone();

      const end = weekEnd.isAfter(monthEnd)
        ? monthEnd.clone()
        : weekEnd.clone();

      baseSql += " AND a.attendance_date BETWEEN ? AND ?";
      params.push(
        start.format("YYYY-MM-DD"),
        end.format("YYYY-MM-DD")
      );
    }

    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;
    const [[{ total }]] = await pool.query(countSql, params);

    const dataSql = `
      SELECT DATE(a.attendance_date) AS date, a.status
      ${baseSql}
      ORDER BY a.attendance_date ASC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await pool.query(dataSql, [
      ...params,
      Number(limit),
      offset,
    ]);

    res.json({
      data: rows,
      total,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch attendance" });
  }
};

const getAttendanceYears = async (req, res) => {
  try {
    const regNo = req.user.reg_no;
    if (!regNo) return res.status(403).json({ error: "Unauthorized" });

    const sql = `
      SELECT DISTINCT YEAR(a.attendance_date) AS year
      FROM student_attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE s.reg_no = ?
      ORDER BY year DESC
    `;

    const [rows] = await pool.query(sql, [regNo]);

    res.json(rows.map((r) => r.year));
  } catch (err) {
    console.error("Attendance years fetch error:", err);
    res.status(500).json({ error: "Failed to load attendance years" });
  }
};

const getWeeksInMonth = (req, res) => {
  try {
    const { year, month } = req.query;

    if (!year || !month) {
      return res.status(400).json({ error: "Year and month are required" });
    }

    const start = moment(`${year}-${month}-01`);
    const end = start.clone().endOf("month");

    const weeks = [];
    let current = start.clone().startOf("isoWeek");
    let index = 1;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const weekStart = current.clone();
      const weekEnd = current.clone().add(6, "days").isAfter(end)
        ? end.clone()
        : current.clone().add(6, "days");

      weeks.push({
        value: index,
        label: `Week ${index} (${weekStart.format(
          "DD MMM"
        )} - ${weekEnd.format("DD MMM")})`,
      });

      current.add(7, "days");
      index++;
    }

    res.json(weeks);
  } catch (err) {
    console.error("Weeks fetch error:", err);
    res.status(500).json({ error: "Failed to load weeks" });
  }
};

module.exports = {
  getAttendance,
  getAttendanceYears,
  getWeeksInMonth,
};
