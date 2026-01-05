import React, { useState } from "react";
import "./Attendance.css";

import StudentList from "./components/StudentList";
import AttendanceMarking from "./components/AttendanceMarking";
import AttendanceReport from "./components/AttendanceReport";

function Attendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [activeView, setActiveView] = useState("");

  return (
    <div className="contentArea">
      <h2 className="pageTitle">ATTENDANCE PROFILE</h2>

      {/* CLASS SELECT */}
      <div className="classSelect">
        <label>Select Class</label>
        <select
          value={selectedClass}
          onChange={(e) => setSelectedClass(e.target.value)}
        >
          <option value="">-- Select --</option>
          <option value="Grade 12">Grade 12</option>
          <option value="Grade 13">Grade 13</option>
        </select>
      </div>

      {/* BUTTONS */}
      <div className="buttonRow">
        <button onClick={() => setActiveView("students")}>
          Student List
        </button>
        <button onClick={() => setActiveView("attendance")}>
          Attendance
        </button>
        <button onClick={() => setActiveView("report")}>
          View Report
        </button>
      </div>

      {/* OUTPUT AREA */}
      <div className="outputBox">
        {!selectedClass && <p>Please select a class</p>}

        {selectedClass && activeView === "students" && (
          <StudentList selectedClass={selectedClass} />
        )}

        {selectedClass && activeView === "attendance" && (
          <AttendanceMarking selectedClass={selectedClass} />
        )}

        {selectedClass && activeView === "report" && (
          <AttendanceReport selectedClass={selectedClass} />
        )}
      </div>

      {/* CLEAR */}
      <div className="clearBtn">
        <button
          onClick={() => {
            setActiveView("");
            setSelectedClass("");
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Attendance;
