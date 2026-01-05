import React, { useState } from "react";
import "./Settings.css";
import { setTheme, getTheme } from "../../utils/theme";


function Settings() {
  const [darkMode, setDarkMode] = useState(getTheme());
  const [notifications, setNotifications] = useState(true);
  const [page, setPage] = useState("settings");
  // "settings" | "about" | "feedback"

  /* ---------- FEEDBACK PAGE ---------- */
  if (page === "feedback") {
    return (
      <div className="contentArea">
        <header className="heading">
          <button className="backBtn" onClick={() => setPage("settings")}>
            ← Back
          </button>
          <h1>Feedback</h1>
        </header>

        <div className="feedback-box">
          <textarea placeholder="Tell us what you think..." />
          <button className="submitBtn">Submit Feedback</button>
        </div>
      </div>
    );
  }

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

        {/* 2️⃣ DARK MODE */}
        <div className="settings-item toggle">
          <span>Dark mode</span>
          <label className="switch">
           <input type="checkbox" checked={darkMode} onChange={() => {const value = !darkMode;
           setDarkMode(value); setTheme(value); }} />
            <span className="slider"></span>
          </label>
        </div>

        {/* 3️⃣ PUSH NOTIFICATIONS */}
        <div className="settings-item toggle">
          <span>Push notifications</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={notifications}
              onChange={() => setNotifications(!notifications)}
            />
            <span className="slider"></span>
          </label>
        </div>

        {/* 4️⃣ FEEDBACK */}
        <div
          className="settings-item"
          onClick={() => setPage("feedback")}
        >
          <span>Feedback</span>
        </div>

      </div>
    </>
  );
}

export default Settings;
