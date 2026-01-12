const db = require("../config/db");

exports.getAvailableYears = async (req, res) => {
  try {
    const { reg_no } = req.query;

    const sql = `
      SELECT DISTINCT er.year
      FROM exam_results er
      JOIN students s ON er.student_id = s.student_id
      WHERE s.reg_no = ?
      ORDER BY er.year DESC
    `;

    const [rows] = await db.execute(sql, [reg_no]);
    res.json(rows.map(r => r.year));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

exports.getAvailableTerms = async (req, res) => {
  try {
    const { reg_no, year } = req.query;

    const sql = `
      SELECT DISTINCT er.term
      FROM exam_results er
      JOIN students s ON er.student_id = s.student_id
      WHERE s.reg_no = ? AND er.year = ?
      ORDER BY FIELD(er.term, '1st', '2nd', '3rd')
    `;

    const [rows] = await db.execute(sql, [reg_no, year]);
    res.json(rows.map(r => r.term));
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

exports.getExamResults = async (req, res) => {
  try {
    const { reg_no, year, term } = req.query;

    const sql = `
      SELECT
        sub.subject_name AS subject,
        er.marks,
        er.grade
      FROM exam_results er
      JOIN students s ON er.student_id = s.student_id
      JOIN subjects sub ON er.subject_id = sub.subject_id
      WHERE s.reg_no = ?
        AND er.year = ?
        AND er.term = ?
    `;

    const [rows] = await db.execute(sql, [reg_no, year, term]);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};