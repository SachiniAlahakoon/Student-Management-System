const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const {
  getClassesForTeacher,
  getSubjectsForTeacherClass,
  getTeacherProfile,
  getTeacherById,
  getTeacherClassAndStudents,
  markAttendance,
  getAttendanceReport,
  checkTodayAttendance
} = require("../controllers/teacher.controller");

router.get("/classes", authenticate, authorizeRole("teacher"), getClassesForTeacher);
router.get("/subjects/:classId", authenticate, authorizeRole("teacher"), getSubjectsForTeacherClass);
router.get("/class-students", authenticate, authorizeRole("teacher"), getTeacherClassAndStudents);
router.post("/mark-attendance", authenticate, authorizeRole("teacher"), markAttendance);
router.get("/check-today-attendance", authenticate, authorizeRole("teacher"), checkTodayAttendance);
router.get("/attendance-report", authenticate, authorizeRole("teacher"), getAttendanceReport);
router.get("/profile/me", authenticate, authorizeRole("teacher"), getTeacherProfile);
router.get("/:tId", authenticate, authorizeRole("teacher", "admin"), getTeacherById);

module.exports = router;
