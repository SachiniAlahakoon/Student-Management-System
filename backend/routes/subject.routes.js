const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * GET SUBJECTS (search + pagination + teacher names)
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = `WHERE s.subject_name LIKE ?`;
      params.push(`%${search}%`);
    }

    // COUNT
    const [[countResult]] = await pool.query(
      `
      SELECT COUNT(DISTINCT s.subject_id) AS total
      FROM subjects s
      ${whereClause}
      `,
      params
    );

    const total = countResult.total;

    // DATA
    const [rows] = await pool.query(
      `
      SELECT
        s.subject_id,
        s.subject_name,
        GROUP_CONCAT(DISTINCT t.teacher_name SEPARATOR ', ') AS teacher_names
      FROM subjects s
      LEFT JOIN teacher_subjects ts ON ts.subject_id = s.subject_id
      LEFT JOIN teachers t ON t.teacher_id = ts.teacher_id
      ${whereClause}
      GROUP BY s.subject_id
      ORDER BY s.subject_id ASC
      LIMIT ? OFFSET ?
      `,
      [...params, limit, offset]
    );

    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

/**
 * ADD SUBJECT
 */
router.post("/", async (req, res) => {
  const { subject_name } = req.body;

  if (!subject_name) {
    return res.status(400).json({ message: "subject_name is required" });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO subjects (subject_name) VALUES (?)`,
      [subject_name]
    );

    res.status(201).json({
      message: "Subject added successfully",
      subject_id: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


/**
 * UPDATE SUBJECT + TEACHERS (FREE-TEXT)
 * Expected body:
 * {
 *   subject_name: "Economics",
 *   teacher_names: ["Devindya", "Chathuranga"],
 *   class_id: 1
 * }
 */
router.put("/:subject_id/teacher", async (req, res) => {
  const { subject_id } = req.params;
  const { subject_name, teacher_names, class_id } = req.body;

  if (!subject_name || !Array.isArray(teacher_names)) {
    return res.status(400).json({
      message: "subject_name and teacher_names[] are required",
    });
  }

  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    // 1️⃣ Update subject name
    const [subjectResult] = await conn.query(
      `UPDATE subjects SET subject_name = ? WHERE subject_id = ?`,
      [subject_name, subject_id]
    );

    if (subjectResult.affectedRows === 0) {
      await conn.rollback();
      return res.status(404).json({ message: "Subject not found" });
    }

    // 2️⃣ Remove old teacher mappings
    await conn.query(
      `DELETE FROM teacher_subjects WHERE subject_id = ?`,
      [subject_id]
    );

    // 3️⃣ Insert new mappings using teacher names
    for (const name of teacher_names) {
      const [[teacher]] = await conn.query(
        `SELECT teacher_id FROM teachers WHERE teacher_name = ?`,
        [name]
      );

      if (!teacher) {
        await conn.rollback();
        return res.status(400).json({
          message: `Teacher not found: ${name}`,
        });
      }

      await conn.query(
        `
        INSERT INTO teacher_subjects (teacher_id, subject_id, class_id)
        VALUES (?, ?, ?)
        `,
        [teacher.teacher_id, subject_id, class_id || 1]
      );
    }

    await conn.commit();

    res.json({ message: "Subject and teachers updated successfully" });
  } catch (err) {
    await conn.rollback();
    console.error(err);
    res.status(500).json({ message: err.message });
  } finally {
    conn.release();
  }
});

/**
 * DELETE SUBJECT
 */
router.delete("/:subject_id", async (req, res) => {
  try {
    const [result] = await pool.query(
      `DELETE FROM subjects WHERE subject_id = ?`,
      [req.params.subject_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
