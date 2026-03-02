const pool = require("../config/db");

async function validateTeacherClass(userId, classId) {
  const [rows] = await pool.query(
    `
    SELECT 1
    FROM teacher_subjects ts
    JOIN teachers t ON ts.teacher_id = t.teacher_id
    WHERE t.user_id = ? AND ts.class_id = ?
    LIMIT 1
    `,
    [userId, classId]
  );

  return rows.length > 0;
}


const getClassesForTeacher = async (req, res) => {
  const userId = req.user.id;
  try {
    const [teacherRows] = await pool.query(
      "SELECT teacher_id FROM teachers WHERE user_id = ?",
      [userId]
    );

    if (!teacherRows.length) {
      return res.status(404).json({ error: "Teacher not found for this user" });
    }

    const teacherId = teacherRows[0].teacher_id;

    const [rows] = await pool.query(
      `SELECT DISTINCT c.class_id, c.class_name 
       FROM classes c
       JOIN teacher_subjects ts ON ts.class_id = c.class_id
       WHERE ts.teacher_id = ?`,
      [teacherId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getClassesForTeacher error:", err);
    res.status(500).json({ error: "Failed to fetch classes" });
  }
};

const getSubjectsForTeacherClass = async (req, res) => {
  const userId = req.user.id;
  const { classId } = req.params;

  try {
    const [teacherRows] = await pool.query(
      "SELECT teacher_id FROM teachers WHERE user_id = ?",
      [userId]
    );

    if (!teacherRows.length) {
      return res.status(404).json({ error: "Teacher not found for this user" });
    }

    const teacherId = teacherRows[0].teacher_id;

    const [rows] = await pool.query(
      `SELECT sub.subject_id, sub.subject_name
       FROM teacher_subjects ts
       JOIN subjects sub ON ts.subject_id = sub.subject_id
       WHERE ts.teacher_id = ? AND ts.class_id = ?`,
      [teacherId, classId]
    );

    res.json(rows);
  } catch (err) {
    console.error("getSubjectsForTeacherClass error:", err);
    res.status(500).json({ error: "Failed to fetch subjects" });
  }
};

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
      return res
        .status(403)
        .json({ message: "Teacher not found or access denied" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error("Error fetching teacher by ID:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getTeacherClasses = async (req, res) => {
  const userId = req.user.id;

  const [rows] = await pool.query(
    `
    SELECT DISTINCT c.class_id, c.class_name
    FROM teacher_subjects ts
    JOIN teachers t ON ts.teacher_id = t.teacher_id
    JOIN classes c ON ts.class_id = c.class_id
    WHERE t.user_id = ?
    `,
    [userId]
  );

  res.json(rows);
};

const getTeacherClassAndStudents = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    // Validate ownership
    const allowed = await validateTeacherClass(userId, classId);
    if (!allowed) {
      return res.status(403).json({ message: "Access denied for this class" });
    }

    // Fetch class info
    const [classRows] = await pool.query(
      `SELECT class_id, class_name FROM classes WHERE class_id = ?`,
      [classId]
    );

    if (!classRows.length) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Fetch students
    const [students] = await pool.query(
      `
      SELECT
        student_id,
        reg_no,
        initals,
        student_firstname,
        student_lastname
      FROM students
      WHERE class_id = ?
      ORDER BY reg_no
      `,
      [classId]
    );

    res.json({
      class_id: classRows[0].class_id,
      class_name: classRows[0].class_name,
      students
    });

  } catch (error) {
    console.error("getTeacherClassAndStudents:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const markAttendance = async (req, res) => {
  let connection;

  try {
    const userId = req.user.id; // This is from users table
    const { classId, date, attendance } = req.body;

    if (!classId || !date || !Array.isArray(attendance)) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    // Get teacher_id from users.user_id
    const [teacherRows] = await pool.query(
      "SELECT teacher_id FROM teachers WHERE user_id = ?",
      [userId]
    );

    if (!teacherRows.length) {
      return res.status(403).json({ message: "Teacher profile not found" });
    }

    const teacherId = teacherRows[0].teacher_id;

    // Validate teacher access to this class
    const allowed = await validateTeacherClass(userId, classId);
    if (!allowed) {
      return res.status(403).json({ message: "Access denied for this class" });
    }

    connection = await pool.getConnection();
    await connection.beginTransaction();

    // Check for duplicate attendance for the same date and class
    const [existing] = await connection.query(
      `
      SELECT COUNT(*) AS count
      FROM student_attendance
      WHERE class_id = ? AND attendance_date = ?
      `,
      [classId, date]
    );

    if (existing[0].count > 0) {
      await connection.rollback();
      return res.status(409).json({
        message: "Attendance already marked for this class and date"
      });
    }

    // Insert attendance for each student
    for (const record of attendance) {
      await connection.query(
        `
        INSERT INTO student_attendance
        (student_id, class_id, attendance_date, status, marked_by)
        VALUES (?, ?, ?, ?, ?)
        `,
        [
          record.student_id,
          classId,
          date,
          record.status,
          teacherId // <-- Correct foreign key
        ]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: "Attendance marked successfully",
      classId,
      date,
      total: attendance.length
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("markAttendance:", error);
    res.status(500).json({ message: "Server error" });
  } finally {
    if (connection) connection.release();
  }
};

const checkTodayAttendance = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const allowed = await validateTeacherClass(userId, classId);
    if (!allowed) {
      return res.status(403).json({ message: "Access denied for this class" });
    }

    const [rows] = await pool.query(
      `
      SELECT COUNT(*) AS count
      FROM student_attendance
      WHERE class_id = ? AND attendance_date = CURDATE()
      `,
      [classId]
    );

    res.json({
      classId,
      alreadyMarked: rows[0].count > 0
    });

  } catch (error) {
    console.error("checkTodayAttendance:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const getAttendanceReport = async (req, res) => {
  try {
    const userId = req.user.id;
    const { classId, period = "daily" } = req.query;

    if (!classId) {
      return res.status(400).json({ message: "classId is required" });
    }

    const allowed = await validateTeacherClass(userId, classId);
    if (!allowed) {
      return res.status(403).json({ message: "Access denied for this class" });
    }

    let dateExpr;
    switch (period) {
      case "weekly":
        dateExpr = `CONCAT(YEAR(attendance_date), '-W', WEEK(attendance_date))`;
        break;
      case "monthly":
        dateExpr = `DATE_FORMAT(attendance_date, '%Y-%m')`;
        break;
      case "yearly":
        dateExpr = `YEAR(attendance_date)`;
        break;
      default:
        dateExpr = `DATE_FORMAT(attendance_date, '%Y-%m-%d')`;
    }

    const [rows] = await pool.query(
      `
      SELECT
        ${dateExpr} AS date,
        status,
        COUNT(*) AS count
      FROM student_attendance
      WHERE class_id = ?
      GROUP BY date, status
      ORDER BY date DESC
      `,
      [classId]
    );

    res.json(rows);

  } catch (error) {
    console.error("getAttendanceReport:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  getClassesForTeacher,
  getSubjectsForTeacherClass,
  getTeacherProfile,
  getTeacherById,
  getTeacherClassAndStudents,
  markAttendance,
  checkTodayAttendance,
   getAttendanceReport
};
