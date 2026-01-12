const pool = require("../config/db");

/**
 * GET /api/teacher/marks
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

  page = parseInt(page);
  limit = parseInt(limit);

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ message: "Missing query parameters" });
  }

  try {
    const searchQuery = `%${search}%`;

    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE er.class_id = ?
         AND er.subject_id = ?
         AND er.term = ?
         AND er.year = ?
         AND (s.student_name LIKE ? OR s.reg_no LIKE ?)`,
      [class_id, subject_id, term, year, searchQuery, searchQuery]
    );

    const total = countRows[0].total;
    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
      `SELECT
         er.result_id,
         s.student_id,
         s.student_name,
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
         AND (s.student_name LIKE ? OR s.reg_no LIKE ?)
       ORDER BY s.student_name
       LIMIT ? OFFSET ?`,
      [
        class_id,
        subject_id,
        term,
        year,
        searchQuery,
        searchQuery,
        limit,
        offset,
      ]
    );

    res.json({ data: rows, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * POST /api/teacher/marks/add
 */
exports.addMarks = async (req, res) => {
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

    await pool.query(
      `INSERT INTO exam_results
       (student_id, subject_id, class_id, year, term, marks, grade)
       VALUES ?`,
      [values]
    );

    res.json({ message: "Marks added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * PUT /api/teacher/marks/update-one
 * Used for BOTH edit and delete
 */
exports.updateSingleMark = async (req, res) => {
  const { result_id, marks } = req.body;

  if (!result_id) {
    return res.status(400).json({ message: "result_id required" });
  }

  try {
    const [result] = await pool.query(
      `UPDATE exam_results
       SET marks = ?, grade = NULL
       WHERE result_id = ?`,
      [marks ?? null, result_id]
    );

    res.json({
      message: "Mark updated",
      affectedRows: result.affectedRows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * DELETE /api/teacher/marks/reset
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
