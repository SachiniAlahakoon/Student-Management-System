/*const express = require("express");
const router = express.Router();
const { getStudentById } = require("../controllers/student.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

//router.get("/:studentId", authenticate, authorizeRole("admin"), getStudentById);
router.get("/me", authenticate, authorizeRole("student"), getStudentById);
router.get("/me/results", authenticate, authorizeRole("student"), getMyResults);

module.exports = router;*/

const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");
const { getStudentProfile, getStudentById } = require("../controllers/student.controller");

// Student sees own profile
router.get("/profile/me", authenticate, authorizeRole("student"), getStudentProfile);

// Admin sees any student
router.get("/:studentId", authenticate, authorizeRole("admin"), getStudentById);

module.exports = router;


