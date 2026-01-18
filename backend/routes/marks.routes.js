const express = require("express");
const router = express.Router();

const { authenticate } = require("../middleware/auth.middleware");
const authorizeRole = require("../middleware/role.middleware");

const {
  getMarks,
  addMarks,
  updateSingleMark,
  deleteMarks,
  upsertMarks,
  getAllMarksForReport
} = require("../controllers/marks.controller");
const isTeacherAssigned = require("../middleware/isTeacherAssigned");

router.get("/", authenticate, authorizeRole("teacher"), isTeacherAssigned, getMarks);
router.post("/add", authenticate, authorizeRole("teacher"), isTeacherAssigned, addMarks);
router.put("/update-one", authenticate, authorizeRole("teacher"), isTeacherAssigned, updateSingleMark);
router.delete("/reset", authenticate, authorizeRole("teacher"), isTeacherAssigned, deleteMarks);
router.put( "/upsert", authenticate, authorizeRole("teacher"), isTeacherAssigned, upsertMarks);
router.get("/all-for-report", authenticate, authorizeRole("teacher"), isTeacherAssigned, getAllMarksForReport);

module.exports = router;
