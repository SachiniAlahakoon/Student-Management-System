const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/* GET ALL TEACHERS */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        t_id,
        id_no,
        name,
        birthday,
        TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age,
        phone,
        email,
        p_in_id
      FROM teacher_p
      ORDER BY t_id DESC
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* GET SINGLE TEACHER */
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  const [[teacher]] = await pool.query(
    `
    SELECT
      t_id,
      id_no,
      name,
      birthday,
      TIMESTAMPDIFF(YEAR, birthday, CURDATE()) AS age,
      phone,
      email,
      p_in_id
    FROM teacher_p
    WHERE t_id = ?
    `,
    [id]
  );

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  res.json(teacher);
});

/* ADD TEACHER */
router.post("/", async (req, res) => {
  const { id_no, name, birthday, phone, email, p_in_id } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO teacher_p
      (id_no, name, birthday, phone, email, p_in_id)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [id_no, name, birthday, phone, email, p_in_id]
    );

    res.status(201).json({ message: "Teacher added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* UPDATE TEACHER */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { id_no, name, birthday, phone, email, p_in_id } = req.body;

  try {
    await pool.query(
      `
      UPDATE teacher_p
      SET id_no = ?, name = ?, birthday = ?, phone = ?, email = ?, p_in_id = ?
      WHERE t_id = ?
      `,
      [id_no, name, birthday, phone, email, p_in_id, id]
    );

    res.json({ message: "Teacher updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* DELETE TEACHER */
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM teacher_p WHERE t_id = ?", [req.params.id]);
  res.json({ message: "Teacher deleted successfully" });
});

module.exports = router;
