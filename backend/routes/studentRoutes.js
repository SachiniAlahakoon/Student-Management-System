const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * 🔹 GET ALL STUDENTS
 * Returns students with calculated age
 */
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        registration_number,
        name,
        class,
        address,
        dob,
        TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
      FROM students
    `);

    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// GET SINGLE STUDENT BY REG NO
router.get("/:regNo", async (req, res) => {
  const { regNo } = req.params;

  try {
    const [[student]] = await pool.query(
      `
      SELECT
        registration_number,
        name,
        class,
        address,
        dob,
        TIMESTAMPDIFF(YEAR, dob, CURDATE()) AS age
      FROM students
      WHERE registration_number = ?
      `,
      [regNo]
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 ADD NEW STUDENT
 * Age is calculated automatically from DOB
 */
router.post("/", async (req, res) => {
  const {
    registration_number,
    name,
    class: studentClass,
    address,
    dob,
  } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO students
      (registration_number, name, class, address, dob)
      VALUES (?, ?, ?, ?, ?)
      `,
      [registration_number, name, studentClass, address, dob]
    );

    res.json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 UPDATE STUDENT
 * If DOB changes, age will automatically update
 */
router.put("/:regNo", async (req, res) => {
  const { regNo } = req.params;
  const {
    name,
    class: studentClass,
    address,
    dob,
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE students
      SET name = ?, class = ?, address = ?, dob = ?
      WHERE registration_number = ?
      `,
      [name, studentClass, address, dob, regNo]
    );

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * 🔹 DELETE STUDENT
 */
router.delete("/:regNo", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM students WHERE registration_number = ?",
      [req.params.regNo]
    );

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
