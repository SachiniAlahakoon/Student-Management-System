const express = require("express");
const router = express.Router();
const pool = require("../config/db");


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1; // 1-based
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search || "";

    const offset = (page - 1) * limit;

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = `
        WHERE
          s.reg_no LIKE ?
          OR s.student_firstname LIKE ?
          OR s.student_lastname LIKE ?
          OR c.class_name LIKE ?
          OR s.address LIKE ?
      `;
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword, keyword);
    }

    
    const [[countResult]] = await pool.query(
      `
      SELECT COUNT(*) AS total
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      JOIN users u ON s.user_id = u.user_id
      ${whereClause}
      `,
      params
    );

    const total = countResult.total;

    
    const [rows] = await pool.query(
      `
      SELECT
        s.student_id,
        s.reg_no,
        s.initals,
        s.student_firstname,
        s.student_lastname,
        CONCAT(s.initals, ' ', s.student_firstname, ' ', s.student_lastname) AS full_name,
        s.address,
        s.birthday,
        TIMESTAMPDIFF(YEAR, s.birthday, CURDATE()) AS age,
        s.admission_date,
        s.blood_type,
        s.Hcondition,
        s.contact1,
        s.contact2,
        c.class_name,
        u.username,
        u.email
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      JOIN users u ON s.user_id = u.user_id
      ${whereClause}
      ORDER BY s.reg_no DESC
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


router.get("/:reg_no", async (req, res) => {
  const { reg_no } = req.params;

  try {
    const [[student]] = await pool.query(
      `
      SELECT
        s.student_id,
        s.reg_no,
        s.initals,
        s.student_firstname,
        s.student_lastname,
        s.address,
        s.birthday,
        TIMESTAMPDIFF(YEAR, s.birthday, CURDATE()) AS age,
        s.admission_date,
        s.blood_type,
        s.Hcondition,
        s.contact1,
        s.contact2,
        c.class_name,
        u.username,
        u.email
      FROM students s
      JOIN classes c ON s.class_id = c.class_id
      JOIN users u ON s.user_id = u.user_id
      WHERE s.reg_no = ?
      `,
      [reg_no]
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  const {
    reg_no,
    initals,
    student_firstname,
    student_lastname,
    address,
    birthday,
    admission_date,
    blood_type,
    Hcondition,
    contact1,
    contact2,
    user_id,
    class_id,
  } = req.body;

  try {
    await pool.query(
      `
      INSERT INTO students
      (reg_no, initals, student_firstname, student_lastname, address,
       birthday, admission_date, blood_type, Hcondition,
       contact1, contact2, user_id, class_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `,
      [
        reg_no,
        initals,
        student_firstname,
        student_lastname,
        address,
        birthday,
        admission_date,
        blood_type,
        Hcondition,
        contact1,
        contact2,
        user_id,
        class_id,
      ]
    );

    res.status(201).json({ message: "Student added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:reg_no", async (req, res) => {
  const { reg_no } = req.params;

  const {
    initals,
    student_firstname,
    student_lastname,
    address,
    birthday,
    admission_date,
    blood_type,
    Hcondition,
    contact1,
    contact2,
    class_id,
  } = req.body;

  try {
    await pool.query(
      `
      UPDATE students
      SET
        initals = ?,
        student_firstname = ?,
        student_lastname = ?,
        address = ?,
        birthday = ?,
        admission_date = ?,
        blood_type = ?,
        Hcondition = ?,
        contact1 = ?,
        contact2 = ?,
        class_id = ?
      WHERE reg_no = ?
      `,
      [
        initals,
        student_firstname,
        student_lastname,
        address,
        birthday,
        admission_date,
        blood_type,
        Hcondition,
        contact1,
        contact2,
        class_id,
        reg_no,
      ]
    );

    res.json({ message: "Student updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:reg_no", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM students WHERE reg_no = ?",
      [req.params.reg_no]
    );

    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;