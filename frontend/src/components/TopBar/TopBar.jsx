import { Link } from "react-router-dom";
import "./TopBar.css";
import logo from "../../assets/images/Swarnamali GCK Logo.png";
import userIcon from "../../assets/images/user.png";
import sortDownLogo from "../../assets/images/sort-down.png";
import SettingsIcon from "@mui/icons-material/Settings";

function TopBar() {
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  const username = user?.username || "User";
  const role = user?.role || "student";

  return (
    <nav className="top-bar">
      <div className="logo-area">
        <img src={logo} alt="logo" className="logo" />

        {/* You can later make this role-based */}
        <Link to="/dashboard/student" className="title">
          Swarnamali Girls College
        </Link>
      </div>

      <div className="right-section">
        <div className="user-info">
          <img src={userIcon} alt="user" className="user-icon" />

          <div className="user-details">
            <span className="user-name">{username}</span>
            <span className="user-role">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>

          <img src={sortDownLogo} alt="menu" className="sort-down-icon" />
        </div>

        <SettingsIcon className="settings-icon" />
      </div>
    </nav>
  );
}

export default TopBar;
