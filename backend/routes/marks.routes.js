const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marks.controller");

router.get("/", marksController.getMarks);

router.post("/add", marksController.addMarks);

router.put("/update-one", marksController.updateSingleMark);

router.delete("/reset", marksController.deleteMarks);

router.get("/all-for-report", marksController.getAllMarksForReport);

module.exports = router;
