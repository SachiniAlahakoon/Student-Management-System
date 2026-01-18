import React from "react";
import "./UserInfoCard.css";
import userIcon from "../../assets/images/user.png";

function UserInfoCard({ compact = false }) {
  return (
    <div className={`user-info ${compact ? "compact" : ""}`}>
      <img src={userIcon} alt="" className="user-icon" />
      <div className="user-details">
        <span className="user-name">N.M. Perera</span>
        <span className="user-role">Teacher</span>
      </div>
    </div>
  );
}

export default UserInfoCard;
