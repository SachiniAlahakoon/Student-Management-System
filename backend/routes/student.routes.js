const express = require("express");
const router = express.Router();
const { getStudentByRegistrationNo } = require("../controllers/student.controller");

router.get("/:regNo", getStudentByRegistrationNo);

module.exports = router;