const express = require("express");
const router = express.Router();
const pool = require("../config/db");


router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);
    const search = req.query.search || "";

    const hasPagination = !isNaN(page) && !isNaN(limit);

    let whereClause = "";
    let params = [];

    if (search) {
      whereClause = `
        WHERE a.name LIKE ?
           OR a.NIC LIKE ?
           OR a.phone LIKE ?
           OR u.username LIKE ?
           OR u.email LIKE ?
      `;
      const keyword = `%${search}%`;
      params.push(keyword, keyword, keyword, keyword, keyword);
    }

   
    if (hasPagination) {
      const offset = (page - 1) * limit;

      const [data] = await pool.query(
        `
        SELECT 
          a.admin_id,
          a.NIC,
          a.name,
          a.phone,
          a.user_id,
          u.username,
          u.email
        FROM admins a
        JOIN users u ON a.user_id = u.user_id
        ${whereClause}
        ORDER BY a.admin_id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, limit, offset]
      );

      const [countResult] = await pool.query(
        `
        SELECT COUNT(*) AS total
        FROM admins a
        JOIN users u ON a.user_id = u.user_id
        ${whereClause}
        `,
        params
      );

      return res.json({
        data,
        total: countResult[0].total,
      });
    }

    
    const [rows] = await pool.query(
      `
      SELECT 
        a.admin_id,
        a.NIC,
        a.name,
        a.phone,
        a.user_id,
        u.username,
        u.email
      FROM admins a
      JOIN users u ON a.user_id = u.user_id
      ${whereClause}
      ORDER BY a.admin_id DESC
      `,
      params
    );

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});


router.post("/", async (req, res) => {
  const { NIC, name, phone, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    await pool.query(
      "INSERT INTO admins (NIC, name, phone, user_id) VALUES (?, ?, ?, ?)",
      [NIC, name, phone, user_id]
    );

    res.json({ message: "Admin added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/:admin_id", async (req, res) => {
  const { NIC, name, phone } = req.body;

  try {
    await pool.query(
      `
      UPDATE admins
      SET NIC = ?, name = ?, phone = ?
      WHERE admin_id = ?
      `,
      [NIC, name, phone, req.params.admin_id]
    );

    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.delete("/:admin_id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM admins WHERE admin_id = ?",
      [req.params.admin_id]
    );

    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
