const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reports.controller");

// GET available years
router.get("/years", reportsController.getAvailableYears);

// GET subject report summary
router.get("/subject-summary", reportsController.getSubjectReport);

module.exports = router;
