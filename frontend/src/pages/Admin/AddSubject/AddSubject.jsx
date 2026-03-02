import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import "./AddSubject.css";

export default function AddSubject() {
  const navigate = useNavigate();

  const [subjectName, setSubjectName] = useState("");
  const [teacherNames, setTeacherNames] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const teacherNamesArray = teacherNames
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      // Create subject
      const res = await axios.post(`${API_BASE}/api/subjects`, {
        subject_name: subjectName,
      });

      // Assign teachers to subject
      if (teacherNamesArray.length > 0) {
        await axios.put(
          `${API_BASE}/api/subjects/${res.data.subject_id}/teacher`,
          {
            subject_name: subjectName,
            teacher_names: teacherNamesArray,
            class_id: 1, 
          }
        );
      }

      toast.success("Subject added successfully 🎉");

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
          <label>Subject Name</label>
          <input
            type="text"
            value={subjectName}
            onChange={(e) => setSubjectName(e.target.value)}
            required
          />
        </div>

        <div className="form-row">
          <label>Teachers</label>
          <input
            type="text"
            placeholder="e.g. Devindya, Chathuranga"
            value={teacherNames}
            onChange={(e) => setTeacherNames(e.target.value)}
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
