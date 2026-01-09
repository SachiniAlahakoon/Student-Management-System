import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import "./AddStudent.css"; 
import { toast } from "react-toastify";




export default function AddStudent() {
  const navigate = useNavigate();

 const [formData, setFormData] = useState({
  registration_number: "",
  name: "",
  class: "",
  address: "",
  dob: "",
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
    await axios.post(`${API_BASE}/api/students`, formData);

    toast.success("Student added successfully 🎉");

    setTimeout(() => {
      navigate("/dashboard/admin/manage-students");
    }, 1200);
  } catch (error) {
    toast.error(
      error.response?.data?.message ||
      "Failed to add student"
    );
  }
};


  return (
    <div className="content">
      <h2 className="form-title">Add New Student</h2>

      <form className="student-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Registration Number</label>
          <input
            name="registration_number"
            value={formData.registration_number}
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
          <label>Class</label>
          <input
            name="class"
            value={formData.class}
            onChange={handleChange}
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
          <label>Date of Birth</label>
          <input
            type="date"
            name="dob"
            value={formData.dob}
            onChange={handleChange}
            required
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
