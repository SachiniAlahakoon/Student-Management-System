import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import "./ViewStudent.css";

export default function ViewStudent() {
  const { regNo } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/students/${regNo}`)
      .then((res) => setStudent(res.data))
      .catch(() => alert("Failed to load student"));
  }, [regNo]);

  if (!student) return <p>Loading...</p>;

  return (
    <div className="content">
      <h2>Student Details</h2>

      <div className="view-card">
        <p><strong>Registration No:</strong> {student.registration_number}</p>
        <p><strong>Name:</strong> {student.name}</p>
        <p><strong>Class:</strong> {student.class}</p>
        <p><strong>Address:</strong> {student.address}</p>
        <p><strong>Date of Birth:</strong> {student.dob?.split("T")[0]}</p>
        <p><strong>Age:</strong> {student.age}</p>
      </div>
    <div className="view-actions">
    <button onClick={() => navigate(-1)}>⬅ Back</button>
    </div>
    </div>
  );
}
