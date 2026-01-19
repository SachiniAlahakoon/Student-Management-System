import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import "./AddAdmin.css";
import { toast } from "react-toastify";

export default function AddAdmin() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    NIC: "",
    name: "",
    phone: "",
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
      // Create user
      const userRes = await axios.post(`${API_BASE}/api/users`, {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role: "admin",
      });

      const user_id = userRes.data.user_id;

      //  Create admin
      await axios.post(`${API_BASE}/api/admins`, {
        NIC: formData.NIC,
        name: formData.name,
        phone: formData.phone,
        user_id,
      });

      toast.success("Admin added successfully 🎉");

      setTimeout(() => {
        navigate("/dashboard/admin/manage-admin");
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add admin"
      );
    }
  };

  return (
    <div className="content">
      <h2 className="form-title">Add New Admin</h2>

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

        {/* Details of admin */}
        <div className="form-row">
          <label>NIC</label>
          <input
            name="NIC"
            value={formData.NIC}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
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
            Save Admin
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard/admin/manage-admin")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
