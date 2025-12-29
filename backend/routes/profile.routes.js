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
