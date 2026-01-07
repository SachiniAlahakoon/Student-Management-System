const pool = require("../config/db");

// Fetch teacher profile based on JWT user id
const getTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authenticate middleware

    const [rows] = await pool.query(
      `SELECT
         t.teacher_id,
         t.id_no,
         t.teacher_name,
         t.birthday,
         t.phone,
         t.email,
         p.years_experience,
         p.qualification,
         p.current_role,
         p.bio
       FROM teachers t
       LEFT JOIN p_information p
         ON t.teacher_id = p.teacher_id
       WHERE t.user_id = ?`,
      [userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Teacher profile not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching teacher profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Optional: Admin fetch teacher by ID
const getTeacherById = async (req, res) => {
  const { teacherId } = req.params;

  try {
    const [rows] = await pool.query(
      `SELECT
         t.teacher_id,
         t.id_no,
         t.teacher_name,
         t.birthday,
         t.phone,
         t.email,
         p.years_experience,
         p.qualification,
         p.current_role,
         p.bio
       FROM teachers t
       LEFT JOIN p_information p
         ON t.teacher_id = p.teacher_id
       WHERE t.teacher_id = ?`,
      [teacherId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTeacherProfile, getTeacherById };
