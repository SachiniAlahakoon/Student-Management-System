const db = require("../config/db");
const dayjs = require("dayjs");
const isoWeek = require("dayjs/plugin/isoWeek");

dayjs.extend(isoWeek);

const getAttendance = async (req, res) => {
  try {
    const { regNo, view } = req.params;
    const { year, month, week, page = 0, limit = 10 } = req.query;

    const offset = Number(page) * Number(limit);

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
      const monthStart = dayjs(`${year}-${month}-01`);
      const monthEnd = monthStart.endOf("month");

      const firstWeekStart = monthStart.startOf("isoWeek");
      const weekStart = firstWeekStart.add(week - 1, "week");
      const weekEnd = weekStart.add(6, "day");

      const start = weekStart.isBefore(monthStart) ? monthStart : weekStart;
      const end = weekEnd.isAfter(monthEnd) ? monthEnd : weekEnd;

      baseSql += " AND a.attendance_date BETWEEN ? AND ?";
      params.push(start.format("YYYY-MM-DD"), end.format("YYYY-MM-DD"));
    }


    const countSql = `SELECT COUNT(*) AS total ${baseSql}`;
    const [[{ total }]] = await db.query(countSql, params);

    
    const dataSql = `
      SELECT DATE(a.attendance_date) AS date, a.status
      ${baseSql}
      ORDER BY a.attendance_date DESC
      LIMIT ? OFFSET ?
    `;

    const [rows] = await db.query(dataSql, [...params, Number(limit), offset]);

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
    const { regNo } = req.params;

    if (!regNo) {
      return res.status(400).json({ error: "regNo is required" });
    }

    const sql = `
      SELECT DISTINCT YEAR(a.attendance_date) AS year
      FROM student_attendance a
      JOIN students s ON s.student_id = a.student_id
      WHERE s.reg_no = ?
      ORDER BY year DESC
    `;

    const [rows] = await db.query(sql, [regNo]);

    const years = rows.map((r) => r.year);
    res.json(years);
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

    const start = dayjs(`${year}-${month}-01`);
    const end = start.endOf("month");

    const weeks = [];
    let current = start.startOf("isoWeek");
    let index = 1;

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const weekStart = current;
      const weekEnd = current.add(6, "day").isAfter(end)
        ? end
        : current.add(6, "day");

      weeks.push({
        value: index,
        label: `Week ${index} (${weekStart.format("DD MMM")} - ${weekEnd.format(
          "DD MMM"
        )})`,
      });

      index++;
      current = current.add(7, "day");
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
