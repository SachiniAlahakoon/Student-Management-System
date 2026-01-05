// Dashboard.jsx
import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SideBar from "../../components/SideBar/SideBar";
import Bottom from "../../components/Bottom/Bottom";
import "./Dashboard.css";

function Dashboard() {
  // Get saved dark mode from localStorage, default false
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  // Save dark mode to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`student-frame ${darkMode ? "dark" : ""}`}>
      <TopBar darkMode={darkMode} />
      <div className="student-content">
        <SideBar darkMode={darkMode} />
        <main className="page-area">
          {/* Pass darkMode state and setter to pages */}
          <Outlet context={{ darkMode, setDarkMode }} />
        </main>
        <Bottom darkMode={darkMode} />
      </div>
    </div>
  );
}

export default Dashboard;

