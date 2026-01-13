const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const {
  getAvailableYears,
  getAvailableTerms,
  getExamResults,
} = require("../controllers/student.controller");

router.get("/years", authenticate, authorizeRole("student"), getAvailableYears);
router.get("/terms", authenticate, authorizeRole("student"), getAvailableTerms);
router.get("/exam-results", authenticate, authorizeRole("student"), getExamResults);

module.exports = router;
