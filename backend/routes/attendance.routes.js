const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendance.controller");

/* STUDENTS */
router.get("/students/:classId", attendanceController.getStudents);

/* MARK ATTENDANCE */
router.post("/mark", attendanceController.markAttendance);

/* REPORT */
router.get("/report/:classId", attendanceController.getReport);

module.exports = router;
