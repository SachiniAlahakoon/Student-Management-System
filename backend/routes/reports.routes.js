const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const reportsController = require("../controllers/reports.controller");
const isTeacherAssigned = require("../middleware/isTeacherAssigned");

router.get("/years", authenticate, authorizeRole("teacher"), reportsController.getAvailableYears);

router.get("/subject-summary", authenticate, authorizeRole("teacher"), isTeacherAssigned, reportsController.getSubjectReport);

module.exports = router;
