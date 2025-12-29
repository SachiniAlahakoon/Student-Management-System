const pool = require("../config/db");

const getTeacherById = async (req, res) => {
  const { tId } = req.params; // match frontend / route param

//  const getTeacherProfile = async (req, res) => {
//  if (req.user.role !== "teacher") {
//    return res.status(403).json({ message: "Not a teacher" });
//  }

  try {
    const [rows] = await pool.query(
      `
      SELECT 
        t.t_id,
        t.id_no,
        t.name,
        t.birthday,
        t.phone,
        t.email,
        p.subject_taught,
        p.class_handle,
        p.y_experince,
        p.quilification,
        p.current_role
      FROM teacher_p t
      JOIN p_information p ON t.t_id = p.t_id
      WHERE t.t_id = ?
      `,
      [tId]

      //  [req.user.userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    const teacher = rows[0];
    res.json(teacher);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getTeacherById };

//module.exports = { getTeacherProfile };

