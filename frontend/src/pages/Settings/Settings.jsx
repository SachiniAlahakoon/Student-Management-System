import React, { useState } from "react";
import "./Settings.css";

function Settings() {
  const [notifications, setNotifications] = useState(true);
  const [page, setPage] = useState("settings");
  // "settings" | "about" | "feedback"

  /* ---------- ABOUT PAGE ---------- */
  if (page === "about") {
    return (
      <div className="contentArea">
        <header className="heading">
          <button className="backBtn" onClick={() => setPage("settings")}>
            ← Back
          </button>
          <h1>About</h1>
        </header>

        <div className="about-box">
          <p><strong>App Name:</strong> Student Management System</p>
          <p><strong>Version:</strong> 1.0.0</p>
          <p>
            This application helps manage students, classes, exams,
            and academic progress for the A/L section of Swarnamali Girl's College, Kandy efficiently.
          </p>
        </div>
      </div>
    );
  }

  /* ---------- MAIN SETTINGS PAGE ---------- */
  return (
    <>
      <header className="heading">
        <h1>Account Settings</h1>
      </header>

      <div className="settings-list">

        {/* 1️⃣ ABOUT */}
        <div className="settings-item" onClick={() => setPage("about")}>
          <span>About</span>
        </div>

        {/* Notifications toggle (optional - keep if needed) */}
        {/* <div className="settings-item toggle">
          <span>Notifications</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={() => setNotifications(!notifications)} 
            />
            <span className="slider"></span>
          </label>
        </div> */}

      </div>
    </>
  );
}

export default Settings;