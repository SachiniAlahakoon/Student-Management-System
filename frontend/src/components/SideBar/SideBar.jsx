import React from "react";
import "./SideBar.css";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import AssessmentIcon from "@mui/icons-material/Assessment";
import SettingsIcon from "@mui/icons-material/Settings";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import EditNoteIcon from "@mui/icons-material/EditNote";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { useLocation, useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";
function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Get logged-in user
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  return (
    <ul>
      <div className="side-bar">
        <div className="side-bar-items">

          {/* 🔐 ADMIN ONLY LINKS */}
          {role === "admin" && (
            <>
              <li
                className="row"
                id={location.pathname === "/dashboard/admin/manage-students" ? "active" : ""}
                onClick={() => navigate("/dashboard/admin/manage-students")}
              >
                <div id="icon"><PeopleIcon /></div>
                <div id="title">Manage Students</div>
              </li>

              <li
                className="row"
                id={location.pathname === "/admin/teachers" ? "active" : ""}
                onClick={() => navigate("/admin/teachers")}
              >
                <div id="icon"><SchoolIcon /></div>
                <div id="title">Manage Teachers</div>
              </li>

              <li
                className="row"
                id={location.pathname === "/admin/reports" ? "active" : ""}
                onClick={() => navigate("/admin/reports")}
              >
                <div id="icon"><AssessmentIcon /></div>
                <div id="title">View Reports</div>
              </li>

              <li
                className="row"
                id={location.pathname === "/admin/settings" ? "active" : ""}
                onClick={() => navigate("/admin/settings")}
              >
                <div id="icon"><SettingsIcon /></div>
                <div id="title">System Settings</div>
              </li>
            </>
          )}

          {/* 🎓 STUDENT ONLY LINKS */}
          {role === "student" && (
            <>
              <li
                className="row"
                id={location.pathname === "/student/results" ? "active" : ""}
                onClick={() => navigate("/student/results")}
              >
                <div id="icon"><FactCheckIcon /></div>
                <div id="title">View Results</div>
              </li>

              <li
                className="row"
                id={location.pathname === "/student/attendance" ? "active" : ""}
                onClick={() => navigate("/student/attendance")}
              >
                <div id="icon"><EventAvailableIcon /></div>
                <div id="title">View Attendance</div>
              </li>
            </>
          )}

          {/* 🧑‍🏫 TEACHER ONLY LINKS */}
          {role === "teacher" && (
            <>
              <li
                className="row"
                id={location.pathname === "/teacher/results" ? "active" : ""}
                onClick={() => navigate("/teacher/results")}
              >
                <div id="icon"><EditNoteIcon /></div>
                <div id="title">Enter Student Results</div>
              </li>

              <li
                className="row"
                id={location.pathname === "/teacher/attendance" ? "active" : ""}
                onClick={() => navigate("/teacher/attendance")}
              >
                <div id="icon"><PlaylistAddCheckIcon /></div>
                <div id="title">Enter Attendance</div>
              </li>
            </>
          )}

        </div>

        {/* Logout */}
        <div className="logout">
          <li
            className="logout-item"
            onClick={() => {
              localStorage.clear();
              navigate("/");
            }}
          >
            <div id="icon"><LogoutIcon /></div>
            <div id="title">Logout</div>
          </li>
        </div>
      </div>
    </ul>
  );
}

export default SideBar;
