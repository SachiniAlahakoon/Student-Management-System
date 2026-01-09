import { useEffect, useState } from "react";
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

export default SideBar;
