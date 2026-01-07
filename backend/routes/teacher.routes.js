const express = require("express");
const router = express.Router();
const { getTeacherById } = require("../controllers/teacher.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

// Only teacher themselves or admin can access
router.get("/:tId", authenticate, authorizeRole("teacher", "admin"), getTeacherById);

module.exports = router;
