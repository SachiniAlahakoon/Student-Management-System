import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import "./AddTeacher.css";

export default function AddTeacher() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id_no: "",
    name: "",
    birthday: "",
    phone: "",
    email: "",
    p_in_id: "",
  });

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // SUBMIT FORM
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_BASE}/api/teachers`, formData);

      toast.success("Teacher added successfully 🎉");

      // Redirect after success
      setTimeout(() => {
        navigate("/dashboard/admin/manage-teachers");
      }, 1200);
    } catch (err) {
      toast.error("Failed to add teacher");
    }
  };

  return (
    <div className="content">
      <h2>Add New Teacher</h2>

      <form className="teacher-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>ID No</label>
          <input
            type="text"
            name="id_no"
            value={formData.id_no}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
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
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>

        <div className="form-row">
          <label>Program ID</label>
          <input
            type="number"
            name="p_in_id"
            value={formData.p_in_id}
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
