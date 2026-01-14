/*import { Link } from "react-router-dom";
import './TopBar.css';
import logo from '../../assets/images/Swarnamali GCK Logo.png';
import SettingsIcon from '@mui/icons-material/Settings';

function TopBar() {
  return (
    <nav className="top-bar">
        <div className="logo-area">
            <img src={ logo } alt="" className="logo" />
            <Link to="/student/exam-results" className="title">Swarnamali Girls College</Link>
        </div>
        <div className="right-section">
            <SettingsIcon className="settings-icon" />
        </div>
    </nav>
  )
}

export default TopBar*/

import { Link } from "react-router-dom";
import "./TopBar.css";
import logo from "../../assets/images/Swarnamali GCK Logo.png";
import userIcon from "../../assets/images/user.png";
import UserInfoCard from "../UserInfoCard/UserInfoCard";

function TopBar() {
  // Get logged-in user info from localStorage (set during login)
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const username = user.username || "User";
  const role = user.role || "student";

  // Generate dashboard link dynamically based on role
  const dashboardLink =
    role === "admin"
      ? "/dashboard/admin"
      : role === "teacher"
      ? "/dashboard/teacher/t-profile"
      :role === "student"
       "/dashboard/student/s-profile";

  return (
    <nav className="top-bar">
      {/* Logo and school title */}
      <div className="logo-area">
        <img src={logo} alt="logo" className="logo" />
        <Link to={dashboardLink} className="title">
          Swarnamali Girls College
        </Link>
      </div>

      {/* Right section with user info */}
      <div className="right-section">
        <div className="user-info">
          <img src={userIcon} alt="user" className="user-icon" />
          <div className="user-details">
            <span className="user-name">{username}</span>
            <span className="user-role">
              {role.charAt(0).toUpperCase() + role.slice(1)}
            </span>
          </div>
        </div>

        {/* Optional compact user card */}
        <div className="user-info-card">
          <UserInfoCard compact />
        </div>
      </div>
    </nav>
  );
}

export default TopBar;
