const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all admins
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM admins");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD admin
router.post("/", async (req, res) => {
  const { NIC, name, phone } = req.body;

  try {
    await pool.query(
      "INSERT INTO admins (NIC, name, phone) VALUES (?, ?, ?)",
      [NIC, name, phone]
    );
    res.json({ message: "Admin added successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
// UPDATE admin
router.put("/:id", async (req, res) => {
  const { NIC, name, phone } = req.body;

  try {
    await pool.query(
      "UPDATE admins SET NIC = ?, name = ?, phone = ? WHERE id = ?",
      [NIC, name, phone, req.params.id]
    );

    res.json({ message: "Admin updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE admin
router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM admins WHERE id = ?", [req.params.id]);
    res.json({ message: "Admin deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
