import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import "./AddSubject.css";

export default function AddSubject() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Subject_ID: "",
    Subject_Name: "",
    Subject_Teacher_Name: "",
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
      await axios.post(`${API_BASE}/api/subjects`, formData);

      toast.success("Subject added successfully 🎉");

      // redirect after short delay
      setTimeout(() => {
        navigate("/dashboard/admin/manage-subjects");
      }, 1200);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add subject"
      );
    }
  };

  return (
    <div className="content">
      <h2 className="form-title">Add New Subject</h2>

      <form className="subject-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Subject ID</label>
          <input
            type="number"
            name="Subject_ID"
            value={formData.Subject_ID}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Subject Name</label>
          <input
            type="text"
            name="Subject_Name"
            value={formData.Subject_Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-row">
          <label>Teacher Name</label>
          <input
            type="text"
            name="Subject_Teacher_Name"
            value={formData.Subject_Teacher_Name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-primary">
            Save Subject
          </button>
          <button
            type="button"
            className="btn-secondary"
            onClick={() => navigate("/dashboard/admin/manage-subjects")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
