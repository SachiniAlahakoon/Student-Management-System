import React, { useState } from "react";
import "./Settings.css";


function Settings() {
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <>
      <div className="contentArea">
        <header className="heading">
          <h1>Account Settings</h1>
        </header>

        <div className="settings-list">
          <div className="settings-item">
            <span>Edit profile</span>
          </div>

          <div className="settings-item">
            <span>Change password</span>
          </div>

          <div className="settings-item toggle">
            <span>Dark mode</span>
            <label className="switch">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={() => setDarkMode(!darkMode)}
              />
              <span className="slider"></span>
            </label>
          </div>

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
        </div>
      </div>
    </>
  );
}

export default Settings;
