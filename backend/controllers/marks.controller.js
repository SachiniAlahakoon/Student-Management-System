const pool = require("../config/db");

/**
 * GET marks (paginated)
 */
exports.getMarks = async (req, res) => {
  let {
    class_id,
    subject_id,
    term,
    year,
    page = 1,
    limit = 10,
    search = "",
  } = req.query;

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ message: "Missing query parameters" });
  }

  page = parseInt(page);
  limit = parseInt(limit);
  const offset = (page - 1) * limit;
  const searchQuery = `%${search}%`;

  try {
    const [[{ total }]] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE er.class_id = ?
         AND er.subject_id = ?
         AND er.term = ?
         AND er.year = ?
         AND (CONCAT(s.student_firstname, ' ', s.student_lastname) LIKE ? OR s.reg_no LIKE ?)`,
      [class_id, subject_id, term, year, searchQuery, searchQuery]
    );

    const [rows] = await pool.query(
      `SELECT
         er.result_id,
         s.student_id,
         CONCAT(s.student_firstname, ' ', s.student_lastname) AS student_name,
         s.reg_no,
         er.marks,
         er.grade,
         er.term,
         er.year
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE er.class_id = ?
         AND er.subject_id = ?
         AND er.term = ?
         AND er.year = ?
         AND (CONCAT(s.student_firstname, ' ', s.student_lastname) LIKE ? OR s.reg_no LIKE ?)
       ORDER BY s.student_firstname, s.student_lastname
       LIMIT ? OFFSET ?`,
      [class_id, subject_id, term, year, searchQuery, searchQuery, limit, offset]
    );

    res.json({ data: rows, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * ADD marks (bulk)
 */
exports.addMarks = async (req, res) => {
  const teacherId = req.user.id;
  const { class_id, subject_id, year, term, marks } = req.body;

  if (!class_id || !subject_id || !year || !term || !marks?.length) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    const values = marks.map((m) => [
      m.student_id,
      subject_id,
      class_id,
      year,
      term,
      m.marks,
      null,
    ]);

    const sql = `
      INSERT INTO exam_results
      (student_id, subject_id, class_id, year, term, marks, grade)
      VALUES ?
      ON DUPLICATE KEY UPDATE marks = VALUES(marks), grade = NULL
    `;

    await pool.query(sql, [values]);

    res.json({ message: "Marks added successfully" });
  } catch (err) {
    console.error("addMarks error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * UPDATE single mark
 */
exports.updateSingleMark = async (req, res) => {
  const { result_id, marks } = req.body;

  if (!result_id) {
    return res.status(400).json({ message: "Missing result_id" });
  }

  try {
    await pool.query(
      `UPDATE exam_results
       SET marks = ?, grade = NULL
       WHERE result_id = ?`,
      [marks ?? null, result_id]
    );

    res.json({ message: "Mark updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * RESET marks (bulk)
 */
exports.deleteMarks = async (req, res) => {
  const { class_id, subject_id, term, year } = req.body;

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ message: "Missing data" });
  }

  try {
    await pool.query(
      `UPDATE exam_results
       SET marks = NULL, grade = NULL
       WHERE class_id = ?
         AND subject_id = ?
         AND term = ?
         AND year = ?`,
      [class_id, subject_id, term, year]
    );

    res.json({ message: "Marks reset successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * GET all marks for reports
 */
exports.getAllMarksForReport = async (req, res) => {
  const { class_id, subject_id, term, year } = req.query;

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ error: "Missing parameters" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT 
         s.student_id,
         CONCAT(s.student_firstname, ' ', s.student_lastname) AS student_name,
         COALESCE(er.marks, 'Not Entered') AS marks,
         COALESCE(er.grade, '-') AS grade
       FROM students s
       LEFT JOIN exam_results er ON er.student_id = s.student_id
         AND er.class_id = ?
         AND er.subject_id = ?
         AND er.term = ?
         AND er.year = ?
       WHERE s.class_id = ?
       ORDER BY s.student_firstname, s.student_lastname`,
      [class_id, subject_id, term, year, class_id]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch marks for report" });
  }
};
