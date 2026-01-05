import { Link } from "react-router-dom";
import "./TopBar.css";
import logo from "../../assets/images/Swarnamali GCK Logo.png";
import UserInfoCard from "../UserInfoCard/UserInfoCard";

function TopBar() {
  return (
    <nav className="top-bar">
      <div className="logo-area">
        <img src={logo} alt="" className="logo" />
        <Link to="/student/exam-results" className="title">
          Swarnamali Girls College
        </Link>
      </div>

      <div className="right-section">
        <UserInfoCard compact />
      </div>
    </nav>
  );
}

export default TopBar;
