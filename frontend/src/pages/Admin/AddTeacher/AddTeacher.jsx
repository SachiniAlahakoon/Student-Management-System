import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import "./AddTeacher.css";

export default function AddTeacher() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    // details for login
    username: "",
    email: "",
    password: "",

    // teacher details
    id_no: "",
    teacher_name: "",
    birthday: "",
    phone: "",
  });

  // Change handler for form inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Create user
      const userRes = await axios.post(`${API_BASE}/api/users`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "teacher",
      });

      const user_id = userRes.data.user_id;

      // Create teacher
      await axios.post(`${API_BASE}/api/teachers`, {
        id_no: formData.id_no,
        teacher_name: formData.teacher_name,
        birthday: formData.birthday,
        phone: formData.phone,
        email: formData.email,
        user_id,
      });

      toast.success("Teacher added successfully 🎉");

      setTimeout(() => {
        navigate("/dashboard/admin/manage-teachers");
      }, 1200);
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Failed to add teacher"
      );
    }
  };

  return (
    <div className="content">
      <h2>Add New Teacher</h2>

      <form className="teacher-form" onSubmit={handleSubmit}>
        {/* Details for login */}
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

        {/* Details of teacher */}
        <div className="form-row">
          <label>ID No</label>
          <input
            name="id_no"
            value={formData.id_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Name</label>
          <input
            name="teacher_name"
            value={formData.teacher_name}
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
          <label>Phone</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Teacher
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard/admin/manage-teachers")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
