const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const teacherController = require("../controllers/teacher.controller");

router.get("/classes", authenticate, authorizeRole("teacher"), teacherController.getClassesForTeacher);

router.get("/subjects/:classId", authenticate, authorizeRole("teacher"), teacherController.getSubjectsForTeacherClass);

module.exports = router;
