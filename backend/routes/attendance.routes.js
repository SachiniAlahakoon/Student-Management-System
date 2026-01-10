const express = require("express");
const {
  getAttendance,
  getAttendanceYears,
  getWeeksInMonth,
} = require("../controllers/attendance.controller");

const router = express.Router();

router.get("/:regNo/years", getAttendanceYears);
router.get("/weeks", getWeeksInMonth);
router.get("/:regNo/:view", getAttendance);

module.exports = router;
