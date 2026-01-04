const express = require("express");
const router = express.Router();
const pool = require("../config/db");

// GET all subjects
router.get("/", async (req, res) => {
  const [rows] = await pool.query(
    "SELECT Subject_ID, Subject_Name, Subject_Teacher_Name FROM subjects"
  );
  res.json(rows);
});

// ADD subject
router.post("/", async (req, res) => {
  const { Subject_ID, Subject_Name, Subject_Teacher_Name } = req.body;

  try {
    await pool.query(
      "INSERT INTO subjects VALUES (?, ?, ?)",
      [Subject_ID, Subject_Name, Subject_Teacher_Name]
    );
    res.json({ message: "Subject added" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// UPDATE subject
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { Subject_Name, Subject_Teacher_Name } = req.body;

  await pool.query(
    "UPDATE subjects SET Subject_Name=?, Subject_Teacher_Name=? WHERE Subject_ID=?",
    [Subject_Name, Subject_Teacher_Name, id]
  );

  res.json({ message: "Subject updated" });
});

// DELETE subject
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM subjects WHERE Subject_ID=?", [req.params.id]);
  res.json({ message: "Subject deleted" });
});

module.exports = router;
