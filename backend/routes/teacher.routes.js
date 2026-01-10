const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacher.controller");

router.get("/classes/:teacherId", teacherController.getClassesForTeacher);

router.get("/subjects/:teacherId/:classId", teacherController.getSubjectsForTeacherClass);

module.exports = router;