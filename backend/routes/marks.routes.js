const express = require("express");
const router = express.Router();
const marksController = require("../controllers/marks.controller");

/**
 * GET /api/marks
 * Server-side pagination + filtering
 */
router.get("/", marksController.getMarks);

/**
 * POST /api/marks/add
 * Bulk insert marks
 */
router.post("/add", marksController.addMarks);

/**
 * PUT /api/marks/update
 * Bulk update marks
 */
router.put("/update", marksController.updateMarks);

/**
 * DELETE /api/marks/reset
 * Reset marks for a class/subject/term
 */
router.delete("/reset", marksController.deleteMarks);

module.exports = router;
