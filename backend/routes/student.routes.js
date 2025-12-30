const express = require("express");
const router = express.Router();

const {
  getAvailableYears,
  getAvailableTerms,
  getExamResults,
} = require("../controllers/student.controller");

router.get("/years", getAvailableYears);
router.get("/terms", getAvailableTerms);
router.get("/exam-results", getExamResults);

module.exports = router;
