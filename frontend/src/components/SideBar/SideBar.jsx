import React from "react";
import "./SideBar.css";
import { SideBarData } from "./SideBarData.jsx";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import { useLocation, useNavigate } from "react-router-dom";


function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); 

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // FILTER SIDEBAR ITEMS BY ROLE
  const filteredSideBarData = SideBarData.filter(
    (item) => item.role === role
  );

  return (
    <div className="side-bar">
      <div className="side-bar-items">
        {filteredSideBarData.map((val, key) => (
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
