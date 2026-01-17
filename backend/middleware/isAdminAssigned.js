const pool = require("../config/db");

module.exports = async (req, res, next) => {
  try {
    // Only enforce assignment for admins
    if (req.user.role !== "admin") {
      return next();
    }

    const userId = req.user.id; // users.user_id
  

    if (!class_id || !subject_id) {
      return res.status(400).json({
        message: "Admin ID",
      });
    }

    // Resolve admin_id from users.user_id
    const [adminRows] = await pool.query(
      `SELECT admin_id FROM admins WHERE user_id = ?`,
      [userId]
    );

    if (adminRows.length === 0) {
      return res.status(403).json({
        message: "Admin profile not found for this user",
      });
    }

    const adminId = adminRows[0].admin_id;                                                  
    // Check if admin is assigned to this class + subject
    const [assignmentRows] = await pool.query(
      `SELECT 1
       FROM admins
       WHERE admin_id = ?
      `,
      [adminId]
    );

    if (assignmentRows.length === 0) {
      return res.status(403).json({
        message: "You are not an assigned admin for this class and subject",
      });
    }

    next();
  } catch (err) {
    console.error("isAdminAssigned error:", err);
    res.status(500).json({ message: "Authorization failed" });
  }
};