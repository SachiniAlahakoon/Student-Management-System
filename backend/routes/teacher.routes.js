const express = require("express");
const router = express.Router();
const { getTeacherById } = require("../controllers/teacher.controller");

router.get("/:tId", getTeacherById);

module.exports = router;
