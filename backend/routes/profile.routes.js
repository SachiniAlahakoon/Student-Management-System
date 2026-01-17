const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");
const { getStudentProfile } = require("../controllers/student.controller");
const { getTeacherProfile } = require("../controllers/teacher.controller");

// GET /api/profile/me
router.get("/me", authenticate, authorizeRole("student", "teacher"),
  (req, res) => {
    if (req.user.role === "student") {
      return getStudentProfile(req, res);
    }

    if (req.user.role === "teacher") {
      return getTeacherProfile(req, res);
    }

    if (req.user.role === "admin") {
      return res
        .status(400)
        .json({ message: "Admin should use specific routes" });
    }

    return res.status(403).json({ message: "Invalid role" });
  }
);

module.exports = router;
