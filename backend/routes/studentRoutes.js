const express = require("express");
const router = express.Router();
const pool = require("../config/db");

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT id, registration_number, name,email,grade FROM students"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, grade } = req.body;

  try {
    await pool.query(
      "UPDATE students SET name = ?, email = ?, grade = ? WHERE id = ?",
      [name, email, grade, id]
    );

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM students WHERE id = ?", [id]);
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
router.post("/", async (req, res) => {
  const { registration_number, name, email, grade } = req.body;

  try {
    await pool.query(
      "INSERT INTO students (registration_number, name, email, grade) VALUES (?, ?, ?, ?)",
      [registration_number, name, email, grade]
    );

    res.json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

