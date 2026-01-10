const db = require("../config/db");

exports.getAvailableYears = async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT DISTINCT year FROM exam_results ORDER BY year DESC`
    );
    const years = rows.map((r) => r.year);
    res.json(years);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch years" });
  }
};

exports.getSubjectReport = async (req, res) => {
  const { class_id, subject_id, term, year } = req.query;

  if (!class_id || !subject_id || !term || !year) {
    return res.status(400).json({ error: "Missing query parameters" });
  }

  try {
    const [rows] = await db.query(
      `
      SELECT
        s.student_id,
        s.reg_no,
        CONCAT(s.student_firstname, ' ', s.student_lastname) AS student_name,
        er.marks,
        er.grade,
        sub.subject_name,
        c.class_name
      FROM students s
      LEFT JOIN exam_results er ON er.student_id = s.student_id
        AND er.subject_id = ?
        AND er.term = ?
        AND er.year = ?
      LEFT JOIN subjects sub ON sub.subject_id = er.subject_id
      LEFT JOIN classes c ON c.class_id = er.class_id
      WHERE s.class_id = ?
      ORDER BY COALESCE(er.marks, 0) DESC, s.student_firstname, s.student_lastname
      `,
      [subject_id, term, year, class_id]
    );

    if (rows.length === 0) {
      return res.json({
        meta: {},
        stats: {},
        gradeDistribution: [],
        students: [],
      });
    }

    const meta = {
      subject: rows[0].subject_name || "N/A",
      class: rows[0].class_name || "N/A",
      year,
      term,
    };

    const totalStudents = rows.length;
    const attended = rows.filter((r) => r.marks !== null);
    const absent = totalStudents - attended.length;

    const passed = attended.filter((r) => r.marks >= 35).length;
    const failed = attended.length - passed;

    const totalMarks = attended.reduce((sum, r) => sum + r.marks, 0);
    const average = attended.length
      ? Number((totalMarks / attended.length).toFixed(2))
      : 0;

    const passRate = attended.length
      ? Number(((passed / attended.length) * 100).toFixed(2))
      : 0;

    const stats = {
      totalStudents,
      attended: attended.length,
      absent,
      passed,
      failed,
      passRate,
      average,
    };

    const attendedSorted = attended.sort((a, b) => b.marks - a.marks);

    let rank = 1;
    let lastMarks = null;
    let skip = 0;

    attendedSorted.forEach((student) => {
      if (student.marks === lastMarks) {
        student.rank = rank;
        skip++;
      } else {
        rank = rank + skip;
        student.rank = rank;
        skip = 1;
      }
      lastMarks = student.marks;
    });

    const students = rows.map((r) => {
      const attendedStudent = attendedSorted.find(
        (s) => s.student_id === r.student_id
      );
      return {
        reg_no: r.reg_no,
        student_name: r.student_name,
        marks: r.marks,
        grade: r.grade,
        rank: r.marks !== null ? attendedStudent.rank : null,
      };
    });

    const gradeMap = {};
    students.forEach((s) => {
      const label = s.grade ?? "N/A";
      gradeMap[label] = (gradeMap[label] || 0) + 1;
    });

    const gradeDistribution = Object.entries(gradeMap).map(
      ([label, value]) => ({
        label,
        value,
      })
    );

    res.json({
      meta: { class_id, subject_id, year, term },
      stats,
      gradeDistribution,
      students,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to generate subject report" });
  }
};