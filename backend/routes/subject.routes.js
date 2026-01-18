const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * GET SUBJECTS (search + pagination)
 */
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // 1-based
    const limit = parseInt(req.query.limit, 10) || 5;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = `WHERE subject_name LIKE ?`;
      params.push(`%${search}%`);
    }

    // ===== COUNT =====
    const [[countResult]] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM subjects
      ${whereClause}
      `,
      params
    );

    const total = countResult.total;

    // ===== DATA =====
    const [rows] = await pool.query(
      `
      SELECT
        subject_id,
        subject_name
      FROM subjects
      ${whereClause}
      ORDER BY subject_id ASC
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
    await pool.query(
      `INSERT INTO subjects (subject_name) VALUES (?)`,
      [subject_name]
    );

    res.status(201).json({ message: "Subject added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE SUBJECT
 */
router.put("/:subject_id", async (req, res) => {
  const { subject_id } = req.params;
  const { subject_name } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE subjects
      SET subject_name = ?
      WHERE subject_id = ?
      `,
      [subject_name, subject_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Subject not found" });
    }

    res.json({ message: "Subject updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE SUBJECT
 */
router.delete("/:subject_id", async (req, res) => {
  try {
    const [result] = await pool.query(
      "DELETE FROM subjects WHERE subject_id = ?",
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