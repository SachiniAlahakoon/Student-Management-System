const express = require("express");
const router = express.Router();

const reportsController = require("../controllers/reports.controller");

router.get("/years", reportsController.getAvailableYears);

router.get("/subject-summary", reportsController.getSubjectReport);

module.exports = router;
