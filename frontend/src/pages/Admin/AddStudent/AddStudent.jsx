import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import "./AddStudent.css";
import { toast } from "react-toastify";

export default function AddStudent() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // login
    username: "",
    email: "",
    password: "",

    // student
    reg_no: "",
    initals: "",
    student_firstname: "",
    student_lastname: "",
    address: "",
    birthday: "",
    admission_date: "",
    class_id: "",
    contact1: "",
    contact2: "",
    blood_type: "",
    Hcondition: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ================= 1. CREATE USER =================
      const userRes = await axios.post(`${API_BASE}/api/users`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "student",
      });

      const user_id = userRes.data.user_id;

      // ================= 2. CREATE STUDENT =================
      await axios.post(`${API_BASE}/api/students`, {
        reg_no: formData.reg_no,
        initals: formData.initals,
        student_firstname: formData.student_firstname,
        student_lastname: formData.student_lastname,
        address: formData.address,
        birthday: formData.birthday,
        admission_date: formData.admission_date,
        blood_type: formData.blood_type,
        Hcondition: formData.Hcondition,
        contact1: formData.contact1,
        contact2: formData.contact2,
        class_id: formData.class_id,
        user_id,
      });

      toast.success("Student added successfully 🎉");

      setTimeout(() => {
        navigate("/dashboard/admin/manage-students");
      }, 1200);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Failed to add student"
      );
    }
  };

  return (
    <div className="content">
      <h2 className="form-title">Add New Student</h2>

      <form className="student-form" onSubmit={handleSubmit}>
        {/* LOGIN DETAILS */}
        <div className="form-row">
          <label>Username</label>
          <input
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <hr />

        {/* STUDENT DETAILS */}
        <div className="form-row">
          <label>Registration No</label>
          <input
            name="reg_no"
            value={formData.reg_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Initials</label>
          <input
            name="initals"
            value={formData.initals}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>First Name</label>
          <input
            name="student_firstname"
            value={formData.student_firstname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Last Name</label>
          <input
            name="student_lastname"
            value={formData.student_lastname}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Class ID</label>
          <input
            type="number"
            name="class_id"
            value={formData.class_id}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Birthday</label>
          <input
            type="date"
            name="birthday"
            value={formData.birthday}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Admission Date</label>
          <input
            type="date"
            name="admission_date"
            value={formData.admission_date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Address</label>
          <input
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Contact 1</label>
          <input
            name="contact1"
            value={formData.contact1}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Contact 2</label>
          <input
            name="contact2"
            value={formData.contact2}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Blood Type</label>
          <input
            name="blood_type"
            value={formData.blood_type}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Health Condition</label>
          <input
            name="Hcondition"
            value={formData.Hcondition}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Student
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard/admin/manage-students")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
