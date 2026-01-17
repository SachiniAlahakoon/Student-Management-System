import React, { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StudentList from "../../components/StudentList/StudentList";
import AttendanceMarking from "../../components/AttendanceMarking/AttendanceMarking";
import AttendanceReport from "../../components/AttendanceReport/AttendanceReport";

export default function AttendanceContent() {
  const [activeView, setActiveView] = useState("students");

  // Ensure only teachers can access
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user.role !== "teacher") {
      window.location.href = "/login";
    }
  }, []);

  const views = [
    { id: "students", label: "Student List" },
    { id: "attendance", label: "Mark Attendance" },
    { id: "report", label: "View Report" }
  ];

  return (
    <div className="contentArea">
      <ToastContainer position="top-right" autoClose={3000} />

      <header className="heading">
        <h1>Attendance Management</h1>
      </header>

      <div className="action-buttons">
        {views.map((view) => (
          <button
            key={view.id}
            className={`btn ${
              activeView === view.id ? "btn-primary" : "btn-outline"
            }`}
            onClick={() => setActiveView(view.id)}
          >
            {view.label}
          </button>
        ))}
      </div>

      <div className="table-container">
        {activeView === "students" && <StudentList />}
        {activeView === "attendance" && <AttendanceMarking />}
        {activeView === "report" && <AttendanceReport />}
      </div>

      <div className="clear-section">
        <button
          onClick={() => setActiveView("students")}
          className="btn btn-secondary"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
