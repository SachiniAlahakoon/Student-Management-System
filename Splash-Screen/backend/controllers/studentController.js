import Student from "../models/Student.js";
import bcrypt from "bcryptjs";

export const registerStudent = async (req, res) => {
  const { name, email, indexNo, password } = req.body;

  const studentExists = await Student.findOne({ email });
  if (studentExists)
    return res.status(400).json({ message: "Student already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);

  const student = await Student.create({
    name,
    email,
    indexNo,
    password: hashedPassword
  });

  res.status(201).json(student);
};

export const getStudents = async (req, res) => {
  const students = await Student.find().select("-password");
  res.json(students);
};
