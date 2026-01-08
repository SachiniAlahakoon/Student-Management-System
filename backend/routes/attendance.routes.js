const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");

router.get("/:regNo/:view", attendanceController.getAttendance);

module.exports = router;