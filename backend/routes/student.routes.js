const express = require("express");
const router = express.Router();
const { getStudentById } = require("../controllers/student.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

router.get("/:studentId", authenticate, authorizeRole("admin"), getStudentById);

module.exports = router;

