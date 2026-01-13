const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");


const login = async (req, res) => {
  const { username, password } = req.body;
  

  if (!username || !password) {
    return res.status(400).json({ message: "Missing credentials" });
  }

  try {
    const [rows] = await pool.query(
      `SELECT u.*, s.reg_no, t.id_no
       FROM users u
       LEFT JOIN students s ON s.user_id = u.user_id
       LEFT JOIN teachers t ON t.user_id = u.user_id
       LEFT JOIN admins a ON a.user_id = u.user_id
       WHERE u.username = ? OR u.email = ?
       LIMIT 1;`,
      [username, username]
    );

    if (!rows.length) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const user = rows[0];

    // Password check (simplified)
    const isValid = password === user.password_hash; // or use bcrypt.compare in production
    if (!isValid) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    // Build JWT payload
    const payload = {
      id: user.user_id,
      username: user.username,
      role: user.role,
    };

    if (user.role === "student") {
      payload.reg_no = user.reg_no;
    }

    if (user.role === "teacher") {
      payload.id_no = user.id_no;
    }

    if (user.role === "admin") {
      payload.NIC = user.NIC;
    }

    const jwtConfig = require("../config/jwt");
    const token = jwt.sign(payload, jwtConfig.secret, {
      expiresIn: jwtConfig.expiresIn,
    });

    res.json({
      token,
      user: payload, // send same info to frontend
    });
  } catch (err) {
    console.error("LOGIN ERROR", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { login };
