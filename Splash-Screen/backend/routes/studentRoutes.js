import express from "express";
import {
  registerStudent,
  getStudents
} from "../controllers/studentController.js";

const router = express.Router();

router.post("/register", registerStudent);
router.get("/", getStudents);

export default router;
