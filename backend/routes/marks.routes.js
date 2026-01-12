const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marks.controller");

// GET marks (pagination + filters)
router.get("/", marksController.getMarks);

// ADD marks (bulk)
router.post("/add", marksController.addMarks);

// UPDATE or DELETE a single mark
router.put("/update-one", marksController.updateSingleMark);

// RESET marks (bulk)
router.delete("/reset", marksController.deleteMarks);

module.exports = router;
