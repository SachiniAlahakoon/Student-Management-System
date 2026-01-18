const express = require("express");
const router = express.Router();
const pool = require("../config/db");

/**
 * CREATE USER
 */
router.post("/", async (req, res) => {
  const { username, email, password, role } = req.body;

  // validation
  if (!username || !email || !password || !role) {
    return res.status(400).json({
      message: "All fields are required",
    });
  }

  try {
    const [result] = await pool.query(
      `
      INSERT INTO users (username, email, password_hash, role)
      VALUES (?, ?, ?, ?)
      `,
      [username, email, password, role] // (bcrypt later)
    );

    res.status(201).json({
      user_id: result.insertId,
      message: "User created successfully",
    });
  } catch (err) {
    console.error("Create user error:", err);

    // Duplicate email / username
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({
        message: "Username or email already exists",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
});

module.exports = router;
