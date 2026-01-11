/*const express = require("express");
const router = express.Router();
const { getTeacherById } = require("../controllers/teacher.controller");
const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

// Only teacher themselves or admin can access
router.get("/:tId", authenticate, authorizeRole("teacher", "admin"), getTeacherById);

module.exports = router;*/

const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const {
  getTeacherProfile,
  getTeacherById
} = require("../controllers/teacher.controller");

// Teacher sees own profile
router.get("/profile/me", authenticate,
  authorizeRole("teacher"),
  getTeacherProfile
);

// Admin OR teacher (self)
router.get(
  "/:tId",
  authenticate,
  authorizeRole("teacher", "admin"),
  getTeacherById
);

module.exports = router;


