import React from "react";
import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SideBar from "../../components/SideBar/SideBar";
import Bottom from "../../components/Bottom/Bottom";
import "./Dashboard.css";

function Dashboard() {
  return (
    <div className="student-frame">
      <TopBar />
      <div className="student-content">
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
