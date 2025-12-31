const pool = require("../config/db"); // mysql2 promise pool

// Fetch marks for a class, subject, term
exports.getMarks = async (req, res) => {
  const { class_id, subject_id, term, year } = req.query;

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ message: "Missing query parameters" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT er.result_id, s.student_id, s.student_name, er.marks, er.grade, er.term
       FROM exam_results er
       JOIN students s ON er.student_id = s.student_id
       WHERE er.class_id = ? AND er.subject_id = ? AND er.term = ? AND er.year = ?
       ORDER BY s.student_name`,
      [class_id, subject_id, term, year]
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Add new marks
exports.addMarks = async (req, res) => {
  const { class_id, subject_id, term, year, marks } = req.body;

  if (!class_id || !subject_id || !term || !year || !marks || !marks.length) {
    return res.status(400).json({ message: "Missing required data" });
  }

  try {
    const values = marks.map((m) => [
      m.student_id,
      class_id,
      subject_id,
      year,
      term,
      m.marks,
      null, // grade, can calculate later
    ]);

    const sql = `INSERT INTO exam_results 
      (student_id, class_id, subject_id, year, term, marks, grade)
      VALUES ?`;

    await pool.query(sql, [values]);

    res.json({ message: "Marks added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update existing marks
exports.updateMarks = async (req, res) => {
  const { marks } = req.body;

  if (!marks || !marks.length) {
    return res.status(400).json({ message: "No marks provided" });
  }

  try {
    for (let m of marks) {
      await pool.query(
        `UPDATE exam_results
         SET marks = ?, grade = NULL
         WHERE result_id = ?`,
        [m.marks, m.result_id]
      );
    }

    res.json({ message: "Marks updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Generate report (simple student-wise)
exports.getReport = async (req, res) => {
  const { student_id, class_id, year, term } = req.query;

  if (!student_id && !class_id) {
    return res.status(400).json({ message: "Provide student_id or class_id" });
  }

  try {
    let sql = `SELECT s.student_name, c.class_name, sub.subject_name, er.marks, er.grade, er.term, er.year
               FROM exam_results er
               JOIN students s ON er.student_id = s.student_id
               JOIN classes c ON er.class_id = c.class_id
               JOIN subjects sub ON er.subject_id = sub.subject_id
               WHERE 1=1`;

    const params = [];
    if (student_id) {
      sql += " AND s.student_id = ?";
      params.push(student_id);
    }
    if (class_id) {
      sql += " AND c.class_id = ?";
      params.push(class_id);
    }
    if (year) {
      sql += " AND er.year = ?";
      params.push(year);
    }
    if (term) {
      sql += " AND er.term = ?";
      params.push(term);
    }

    sql += " ORDER BY s.student_name, sub.subject_name";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
