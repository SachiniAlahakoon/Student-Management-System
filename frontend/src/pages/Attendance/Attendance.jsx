import React, { useState } from "react";
import "./Attendance.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import StudentList from "./components/StudentList";
import AttendanceMarking from "./components/AttendanceMarking";
import AttendanceReport from "./components/AttendanceReport";

function Attendance() {
  const [selectedClass, setSelectedClass] = useState("");
  const [activeView, setActiveView] = useState("");

  return (
    <div className="contentArea">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <header className="heading">
        <h1>Attendance Management</h1>
      </header>

      {/* CLASS SELECT - Updated to match MarksManagement style */}
      <div className="selection-row" style={{ marginBottom: '20px' }}>
        <div className="form-group">
          <label>Select Class</label>
          <select
            className="form-control"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            style={{ width: '200px' }}
          >
            <option value="">-- Select --</option>
            <option value="12">Grade 12</option>
            <option value="13">Grade 13</option>
          </select>
        </div>
      </div>

      {/* ACTION BUTTONS - Updated styling */}
      <div className="action-buttons" style={{ 
        display: 'flex', 
        gap: '10px', 
        marginBottom: '20px',
        flexWrap: 'wrap' 
      }}>
        <button 
          className={`btn ${activeView === "students" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveView("students")}
          style={{ 
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #1976d2',
            background: activeView === "students" ? '#1976d2' : 'transparent',
            color: activeView === "students" ? 'white' : '#1976d2',
            cursor: 'pointer'
          }}
        >
          Student List
        </button>
        <button 
          className={`btn ${activeView === "attendance" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveView("attendance")}
          style={{ 
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #1976d2',
            background: activeView === "attendance" ? '#1976d2' : 'transparent',
            color: activeView === "attendance" ? 'white' : '#1976d2',
            cursor: 'pointer'
          }}
        >
          Mark Attendance
        </button>
        <button 
          className={`btn ${activeView === "report" ? "btn-primary" : "btn-outline"}`}
          onClick={() => setActiveView("report")}
          style={{ 
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #1976d2',
            background: activeView === "report" ? '#1976d2' : 'transparent',
            color: activeView === "report" ? 'white' : '#1976d2',
            cursor: 'pointer'
          }}
        >
          View Report
        </button>
      </div>

      {/* OUTPUT AREA */}
      <div className="table-container">
        {!selectedClass ? (
          <div className="empty-state">
            <p>Please select a class to continue</p>
          </div>
        ) : (
          <>
            {activeView === "students" && (
              <StudentList selectedClass={selectedClass} />
            )}

            {activeView === "attendance" && (
              <AttendanceMarking selectedClass={selectedClass} />
            )}

            {activeView === "report" && (
              <AttendanceReport selectedClass={selectedClass} />
            )}
          </>
        )}
      </div>

      {/* CLEAR BUTTON */}
      <div style={{ marginTop: '20px', textAlign: 'right' }}>
        <button
          onClick={() => {
            setActiveView("");
            setSelectedClass("");
          }}
          className="btn btn-secondary"
          style={{ 
            padding: '8px 16px',
            borderRadius: '4px',
            border: '1px solid #6c757d',
            background: '#6c757d',
            color: 'white',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}

export default Attendance;