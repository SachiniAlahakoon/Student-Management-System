import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import StSideBar from "../../components/SideBar/StSideBar";
import TeSideBar from "../../components/SideBar/TeSideBar";
import Bottom from "../../components/Bottom/Bottom";
import "./Dashboard.css";

function Dashboard() {
  const location = useLocation();

  // Determine sidebar by checking if the URL contains "teacher"
  const isTeacher = location.pathname.includes("/dashboard/teacher");

  return (
    <div className={isTeacher ? "teacher-frame" : "student-frame"}>
      <TopBar />
      <div className={isTeacher ? "teacher-content" : "student-content"}>
        {isTeacher ? <TeSideBar /> : <StSideBar />}
        <main className="page-area">
          <Outlet />
        </main>
        <Bottom />
      </div>
    </div>
  );
}

export default Dashboard;
