const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../utils/sendEmail");
const pool = require("../config/db");

/* ================= LOGIN ================= */
const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE username = ? OR email = ?",
      [username, username]
    );
    console.log("LOGIN BODY:", req.body);
    console.log("QUERY RESULT:", rows);

    if (rows.length === 0) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];

    // TEMP: plain text comparison (matches your DB)
    if (password !== user.password_hash) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= FORGOT PASSWORD ================= */
const forgotPassword = async (req, res) => {
  console.log("🔥 FORGOT PASSWORD HIT");
  console.log("BODY:", req.body);

  const { email } = req.body;

  if (!email) {
    console.log("❌ EMAIL MISSING");
    return res.status(400).json({ message: "Email required" });
  }

  try {
    const [rows] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    console.log("USER COUNT:", rows.length);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = require("crypto").randomBytes(32).toString("hex");
    const expiry = Date.now() + 15 * 60 * 1000;

    await pool.query(
      "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE email = ?",
      [token, expiry, email]
    );

    console.log("✅ TOKEN SAVED:", token);

    res.json({ message: "Token generated", token });
  } catch (err) {
    console.error("❌ FORGOT ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= RESET PASSWORD ================= */
const resetPassword = async (req, res) => {
  const { token, username, password } = req.body;

  // Basic validation
  if (!token || !username || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // ✅ Verify token + expiry + username
    const [rows] = await pool.query(
      `SELECT id FROM users 
       WHERE reset_token = ? 
       AND reset_token_expiry > ? 
       AND username = ?`,
      [token, Date.now(), username]
    );

    if (rows.length === 0) {
      return res.status(400).json({
        message: "Invalid token, username, or token expired"
      });
    }

    // ✅ Update password & clear reset data
    await pool.query(
      `UPDATE users 
       SET password_hash = ?, 
           reset_token = NULL, 
           reset_token_expiry = NULL 
       WHERE id = ?`,
      [password, rows[0].id]
    );

    res.json({ message: "Password reset successful" });

  } catch (err) {
    console.error("RESET PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  login,
  forgotPassword,
  resetPassword,
};


