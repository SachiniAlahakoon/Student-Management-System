const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * GET TEACHERS (search + pagination)
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
      whereClause = `
        WHERE
          t.teacher_name LIKE ?
          OR t.id_no LIKE ?
          OR t.email LIKE ?
          OR u.username LIKE ?
      `;
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword);
    }

    // COUNT
    const [[countResult]] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN pro_information p ON p.teacher_id = t.teacher_id
      ${whereClause}
      `,
      params
    );

    const total = countResult.total;

    // DATA
    const [rows] = await pool.query(
      `
      SELECT
        t.teacher_id,
        t.id_no,
        t.teacher_name,
        t.birthday,
        TIMESTAMPDIFF(YEAR, t.birthday, CURDATE()) AS age,
        t.phone,
        t.email,
        u.username,
        p.p_in_id,
        p.years_experience,
        p.qualification,
        p.current_role
      FROM teachers t
      JOIN users u ON t.user_id = u.user_id
      LEFT JOIN pro_information p ON p.teacher_id = t.teacher_id
      ${whereClause}
      ORDER BY t.teacher_id DESC
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
 * GET SINGLE TEACHER
 */
router.get("/:teacher_id", async (req, res) => {
  const { teacher_id } = req.params;

  const [[teacher]] = await pool.query(
    `
    SELECT
      t.teacher_id,
      t.id_no,
      t.teacher_name,
      t.birthday,
      TIMESTAMPDIFF(YEAR, t.birthday, CURDATE()) AS age,
      t.phone,
      t.email,
      u.username,
      p.p_in_id,
      p.years_experience,
      p.qualification,
      p.current_role,
      p.bio
    FROM teachers t
    JOIN users u ON t.user_id = u.user_id
    LEFT JOIN pro_information p ON p.teacher_id = t.teacher_id
    WHERE t.teacher_id = ?
    `,
    [teacher_id]
  );

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  res.json(teacher);
});

/**
 * ADD TEACHER
 * user_id must already exist
 */
router.post("/", async (req, res) => {
  const { id_no, teacher_name, birthday, phone, email, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    await pool.query(
      `
      INSERT INTO teachers
      (id_no, teacher_name, birthday, phone, email, user_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [id_no, teacher_name, birthday, phone, email, user_id]
    );

    res.status(201).json({ message: "Teacher added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * UPDATE TEACHER
 */
router.put("/:teacher_id", async (req, res) => {
  const { teacher_id } = req.params;
  const { id_no, teacher_name, birthday, phone, email } = req.body;

  try {
    await pool.query(
      `
      UPDATE teachers
      SET id_no = ?, teacher_name = ?, birthday = ?, phone = ?, email = ?
      WHERE teacher_id = ?
      `,
      [id_no, teacher_name, birthday, phone, email, teacher_id]
    );

    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * DELETE TEACHER
 * (does NOT delete user automatically)
 */
router.delete("/:teacher_id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM teachers WHERE teacher_id = ?",
      [req.params.teacher_id]
    );

    res.json({ message: "Teacher deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
