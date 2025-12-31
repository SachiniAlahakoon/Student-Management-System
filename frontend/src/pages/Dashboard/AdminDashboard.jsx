/*import React from "react";

export default function AdminDashboard() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, Admin!</p>

      <ul>
        <li>Manage Students</li>
        <li>Manage Teachers</li>
        <li>View Reports</li>
        <li>System Settings</li>
      </ul>
    </div>
  );
}*/
import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SideBar from "../../components/SideBar/SideBar";
import "./Dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard-main">
       
        <Outlet />   {/* 👈 Student list loads here */}
      </div>
    </div>
  );
}

