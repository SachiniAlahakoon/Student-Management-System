import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SideBar from "../../components/SideBar/SideBar";
import Bottom from "../../components/Bottom/Bottom";
import "./Dashboard.css";

function Dashboard() {
  const location = useLocation();

  // purely for styling
  const isTeacher = location.pathname.includes("/dashboard/teacher");

  return (
    <div className={isTeacher ? "teacher-frame" : "student-frame"}>
      <TopBar />

      <div className={isTeacher ? "teacher-content" : "student-content"}>
        {/* Sidebar always rendered, content changes by role */}
        <SideBar />

        <main className="page-area">
          <Outlet />
        </main>

        <Bottom />
      </div>
    </div>
  );
}

export default Dashboard;
