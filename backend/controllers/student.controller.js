const pool = require("../config/db");

const getStudentByRegistrationNo = async (req, res) => {
  const { regNo } = req.params; // match frontend prop

 // const getStudentProfile = async (req, res) => {
 // if (req.user.role !== "student") {
 //   return res.status(403).json({ message: "Not a student" });
 // }

  try {
    const [rows] = await pool.query(
      `SELECT reg_no, name, address, birthday, admission_date,blood_type,Hcondition,contact1,contact2 FROM reg_table 
       WHERE reg_no = ?`,
      [regNo]

    //  [req.user.userId]
    );

    if (!rows.length) {
      return res.status(404).json({ message: "Student not found" });
    }

    const student = rows[0];

    res.json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getStudentByRegistrationNo };

//module.exports = { getStudentProfile };