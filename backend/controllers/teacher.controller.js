const pool = require("../config/db");

// Fetch teacher profile based on JWT user id
const getTeacherProfile = async (req, res) => {
  try {
    const userId = req.user.id; // from authenticate middleware

    const [rows] = await pool.query(
      `
      SELECT
        t.teacher_id,
        t.id_no,
        t.teacher_name,
        t.birthday,
        t.phone,
        t.email,

        p.years_experience,
        p.qualification,
        p.current_role,
        p.bio,

        GROUP_CONCAT(DISTINCT s.subject_name ORDER BY s.subject_name SEPARATOR ', ') AS subject_name,
        GROUP_CONCAT(DISTINCT c.class_name ORDER BY c.class_name SEPARATOR ', ') AS class_name

      FROM teachers t
      LEFT JOIN pro_information p
        ON t.teacher_id = p.teacher_id
      LEFT JOIN teacher_subjects ts
        ON t.teacher_id = ts.teacher_id
      LEFT JOIN subjects s
        ON ts.subject_id = s.subject_id
      LEFT JOIN classes c
        ON ts.class_id = c.class_id

      WHERE t.user_id = ?
      GROUP BY t.teacher_id
      `,
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
  const { tId } = req.params;
  const { id: userId, role } = req.user;

  try {
    let query = `
      SELECT
        t.teacher_id, t.id_no, t.teacher_name, t.birthday, t.phone, t.email,
        p.years_experience, p.qualification, p.current_role, p.bio,

        GROUP_CONCAT(DISTINCT s.subject_name ORDER BY s.subject_name SEPARATOR ', ') AS subject_name,
        GROUP_CONCAT(DISTINCT c.class_name ORDER BY c.class_name SEPARATOR ', ') AS class_name

      FROM teachers t
      LEFT JOIN pro_information p
        ON t.teacher_id = p.teacher_id
      LEFT JOIN teacher_subjects ts
        ON t.teacher_id = ts.teacher_id
      LEFT JOIN subjects s
        ON ts.subject_id = s.subject_id
      LEFT JOIN classes c
        ON ts.class_id = c.class_id

      WHERE t.user_id = ?
      GROUP BY t.teacher_id
    `;
    let params = [tId];

    // If teacher, enforce ownership
    if (role === "teacher") {
      query += " AND t.user_id = ?";
      params.push(userId);
    }

    const [rows] = await pool.query(query, params);

    if (!rows.length) {
      return res.status(403).json({ message: "Teacher not found or access denied" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = { getTeacherProfile, getTeacherById };