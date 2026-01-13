const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const marksController = require("../controllers/marks.controller");
const isTeacherAssigned = require("../middleware/isTeacherAssigned");

router.get("/", authenticate, authorizeRole("teacher"), isTeacherAssigned, marksController.getMarks);

router.post("/add", authenticate, authorizeRole("teacher"), isTeacherAssigned, marksController.addMarks);

router.put("/update-one", authenticate, authorizeRole("teacher"), isTeacherAssigned, marksController.updateSingleMark);

router.delete("/reset", authenticate, authorizeRole("teacher"), isTeacherAssigned, marksController.deleteMarks);

router.get("/all-for-report", authenticate, authorizeRole("teacher"), isTeacherAssigned, marksController.getAllMarksForReport);

module.exports = router;
