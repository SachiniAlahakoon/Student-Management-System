/*const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getStudentProfile } = require("../controllers/student.controller");
const { getTeacherProfile } = require("../controllers/teacher.controller");

router.get("/me", authenticate, (req, res) => {
  if (req.user.role === "student") {
    return getStudentProfile(req, res);
  }

  if (req.user.role === "teacher") {
    return getTeacherProfile(req, res);
  }

  res.status(403).json({ message: "Invalid role" });
});

module.exports = router;*/

/*const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth");
const { getStudentProfile } = require("../controllers/student.controller");
const { getTeacherProfile } = require("../controllers/teacher.controller");

router.get("/me", authenticate, (req, res) => {
  const { role } = req.user;

  if (role === "student") {
    if (!req.user.reg_no) {
      return res.status(400).json({ message: "Student reg_no missing" });
    }
    return getStudentProfile(req, res);
  }

  if (role === "teacher") {
    if (!req.user.id_no) {
      return res.status(400).json({ message: "Teacher id_no missing" });
    }
    return getTeacherProfile(req, res);
  }

  return res.status(403).json({ message: "Invalid role" });
});

module.exports = router;
*/ 