const express = require("express");

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const {
  getAttendance,
  getAttendanceYears,
  getWeeksInMonth,
} = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/years", authenticate, authorizeRole("student"), getAttendanceYears);
router.get("/weeks", authenticate, authorizeRole("student"), getWeeksInMonth);
router.get("/:view", authenticate, authorizeRole("student"), getAttendance);

module.exports = router;
