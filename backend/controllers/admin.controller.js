const pool = require("../config/db");

/**
 * GET ADMINS (search + pagination)
 */
exports.getAdmins = async (req, res) => {
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

    // ===============================
    // PAGINATED
    // ===============================
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
          u.email,
          u.created_at
        FROM admins a
        JOIN users u ON a.user_id = u.user_id
        ${whereClause}
        ORDER BY a.admin_id DESC
        LIMIT ? OFFSET ?
        `,
        [...params, limit, offset]
      );

      const [count] = await pool.query(
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
        total: count[0].total,
      });
    }

    // ===============================
    // NO PAGINATION
    // ===============================
    const [rows] = await pool.query(
      `
      SELECT
        a.admin_id,
        a.NIC,
        a.name,
        a.phone,
        a.user_id,
        u.username,
        u.email,
        u.created_at
      FROM admins a
      JOIN users u ON a.user_id = u.user_id
      ${whereClause}
      ORDER BY a.admin_id DESC
      `,
      params
    );

    res.json(rows);
  } catch (error) {
    console.error("Get admins error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * CREATE ADMIN
 * user_id must exist in users table
 */
exports.createAdmin = async (req, res) => {
  const { NIC, name, phone, user_id } = req.body;

  if (!user_id) {
    return res.status(400).json({ message: "user_id is required" });
  }

  try {
    await pool.query(
      `
      INSERT INTO admins (NIC, name, phone, user_id)
      VALUES (?, ?, ?, ?)
      `,
      [NIC, name, phone, user_id]
    );

    res.status(201).json({ message: "Admin created successfully" });
  } catch (error) {
    console.error("Create admin error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * UPDATE ADMIN
 */
exports.updateAdmin = async (req, res) => {
  const { admin_id } = req.params;
  const { NIC, name, phone } = req.body;

  try {
    const [result] = await pool.query(
      `
      UPDATE admins
      SET NIC = ?, name = ?, phone = ?
      WHERE admin_id = ?
      `,
      [NIC, name, phone, admin_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin updated successfully" });
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE ADMIN
 * (does not delete user automatically)
 */
exports.deleteAdmin = async (req, res) => {
  const { admin_id } = req.params;

  try {
    const [result] = await pool.query(
      "DELETE FROM admins WHERE admin_id = ?",
      [admin_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({ message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Delete admin error:", error);
    res.status(500).json({ message: error.message });
  }
};
