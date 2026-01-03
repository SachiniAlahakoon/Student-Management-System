import "./SideBar.css";
import { StSideBarData } from "./StSideBarData.jsx"; 
import LogoutIcon from "@mui/icons-material/Logout";
import { useLocation, useNavigate } from "react-router-dom";
import userIcon from "../../assets/images/user.png";

function StSideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  // HARDCODED FOR NOW
  const userName = "S.M. Silva";
  const userRole = "Student";

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="side-bar">
      <div className="side-bar-items">
        {StSideBarData.map((val, key) => (  
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
  );
}

export default StSideBar;
