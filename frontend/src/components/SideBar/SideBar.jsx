/*import { useEffect, useState } from "react";
import "./SideBar.css";
import { SideBarData } from "./SideBarData.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import userIcon from "../../assets/images/user.png";
import { API_BASE } from "../../api/config.js";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const menuItems = SideBarData[userRole] || [];

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${API_BASE}/api/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load user");
        return res.json();
      })
      .then((data) => {
        // STUDENT
        if (data.student_firstname) {
          setUserName(`${data.student_firstname} ${data.student_lastname}`);
          setUserRole("student");
        }
        // TEACHER
        else if (data.teacher_name) {
          setUserName(data.teacher_name);
          setUserRole("teacher");
        }
        //ADMIN
        //else if (data.admin_name) {
        //  setUserName(data.admin_name);
        //  setUserRole("admin")
        // }
      })
      .catch(() => {
        localStorage.clear();
        navigate("/login");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
   <div className="side-bar">   
    <div className="side-bar-items">
      {menuItems.map((val, key) => (
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

      <div className="user-info-card">
        <div className="user-info">
          <img src={userIcon} alt="user" className="user-icon" />
          <div className="user-details">
            <span className="user-name">{userName || "User"}</span>
            <span className="user-role">
              {userRole === "teacher" ? "Teacher" : "Student"}
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
    </div>
  );

}

export default SideBar;*/

import "./SideBar.css";
import { SideBarData } from "./SideBarData.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role) {
      setUserRole(role.toLowerCase());
    }
  }, []);

  const menuItems = SideBarData[userRole] ?? [];

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="side-bar">
      <div className="side-bar-items">
        {menuItems.map((val, key) => (
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

      <div className="side-bar-bottom">
        <li className="settings">
          <div className="settings-item">
            <div id="icon">
              <SettingsIcon />
            </div>
            <div id="title">Settings</div>
          </div>
        </li>

        <li className="logout" onClick={logout}>
          <div className="logout-item">
            <div id="icon">
              <LogoutIcon />
            </div>
            <div id="title">Logout</div>
          </div>
        </li>
      </div>
    </div>
  );
}

export default SideBar;
