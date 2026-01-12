import React from "react";
import "./SideBar.css";
import { SideBarData } from "./SideBarData.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import userIcon from "../../assets/images/user.png";

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="side-bar">
      <div className="side-bar-items">
        {SideBarData.map((val, key) => {
          return (
            <li
              key={key}
              className="side-bar-row"
              id={location.pathname === val.link ? "active" : ""}
              onClick={() => navigate(val.link)}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          );
        })}
      </div>

      <div className="user-info-card">
        <div className="user-info">
          <img src={userIcon} alt="" className="user-icon" />
          <div className="user-details">
            <span className="user-name">N.M. Perera</span>
            <span className="user-role">Student</span>
          </div>
        </div>

        <div className="logout">
          <li className="logout-item" onClick={logout}>
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
