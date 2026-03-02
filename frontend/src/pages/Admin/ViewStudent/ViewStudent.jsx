import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import "./ViewStudent.css";

export default function ViewStudent() {
  const { regNo } = useParams(); // reg_no from URL
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
        <p>
          <strong>Registration No:</strong> {student.reg_no}
        </p>

        <p>
          <strong>Name:</strong>{" "}
          {student.initals} {student.student_firstname}{" "}
          {student.student_lastname}
        </p>

        <p>
          <strong>Class:</strong> {student.class_name}
        </p>

        <p>
          <strong>Address:</strong> {student.address}
        </p>

        <p>
          <strong>Date of Birth:</strong>{" "}
          {student.birthday?.split("T")[0]}
        </p>

        <p>
          <strong>Age:</strong> {student.age}
        </p>

        <p>
          <strong>Admission Date:</strong>{" "}
          {student.admission_date?.split("T")[0]}
        </p>

        <p>
          <strong>Blood Type:</strong> {student.blood_type || "N/A"}
        </p>

        <p>
          <strong>Health Condition:</strong>{" "}
          {student.Hcondition || "None"}
        </p>

        <p>
          <strong>Contact 1:</strong> {student.contact1}
        </p>

        <p>
          <strong>Contact 2:</strong> {student.contact2 || "N/A"}
        </p>

        <p>
          <strong>Username:</strong> {student.username}
        </p>

        <p>
          <strong>Email:</strong> {student.email}
        </p>
      </div>

      <div className="view-actions">
        <button onClick={() => navigate(-1)}>⬅ Back</button>
      </div>
    </div>
  );
}
