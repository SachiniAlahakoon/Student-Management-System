import React from "react";
/*import "./SideBar.css";
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
                onClick={() => navigate("/dashboard/admin/manage-teachers")}
              >
                <div id="icon"><SchoolIcon /></div>
                <div id="title">Manage Teachers</div>
              </li>

            <li
              className="row"
              id={location.pathname === "/dashboard/admin/manage-subjects" ? "active" : ""}
              onClick={() => navigate("/dashboard/admin/manage-subjects")}
            >
            <div id="icon"><AssessmentIcon /></div>
            <div id="title">Manage Subjects</div>
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

export default SideBar;*/
import "./SideBar.css";
import { SideBarData } from "./SideBarData.jsx"; 
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import userIcon from "../../assets/images/user.png";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // HARDCODED FOR NOW
  const userName = "S.M. Silva";
  const userRole = "student";

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="side-bar">
      <div className="side-bar-items">
        {SideBarData.map((val, key) => (  
          <li
            key={key}
            className="side-bar-row"
            id={location.pathname === val.link ? "active" : ""}
            onClick={() => navigate(val.link)}
          >
            <div id="icon">{val.icon}</div>
            <div id="title">{val.title}</div>
          </li>
        ))}
      </div>

      <div className="user-info-card">
        <div className="user-info">
          <img src={userIcon} alt="user" className="user-icon" />
          <div className="user-details">
            <span className="user-name">{userName}</span>
            <span className="user-role">
              {userRole === "admin" ? "Admin" : "Student"}
            </span>
          </div>
        </div>

        <div className="logout">
          <li className="logout-item" onClick={handleLogout}>
            <div id="icon">
              <LogoutIcon />
            </div>
            <div id="title">Logout</div>
          </li>
        </div>
      </div>
    </div>
  );
}

export default SideBar;