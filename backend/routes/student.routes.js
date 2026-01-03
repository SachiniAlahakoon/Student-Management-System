const express = require("express");
const router = express.Router();
const { getStudentById } = require("../controllers/student.controller");

router.get("/:studentId", getStudentById);

module.exports = router;