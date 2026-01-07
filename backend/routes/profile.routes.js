const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { getStudentProfile } = require("../controllers/student.controller");
const { getTeacherProfile } = require("../controllers/teacher.controller");

// GET /api/profile/me
router.get("/me", authenticate, (req, res) => {
  const { role } = req.user;

  try {
    if (role === "student") {
      return getStudentProfile(req, res);
    }

    if (role === "teacher") {
      return getTeacherProfile(req, res);
    }
    if (role === "admin") {
      return res
        .status(400)
        .json({ message: "Admin should use specific routes" });
    }
    return res.status(403).json({ message: "Invalid role" });
  } catch (error) {
    console.error("Profile route error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
