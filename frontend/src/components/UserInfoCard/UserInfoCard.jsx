import React from "react";
import "./UserInfoCard.css";
import userIcon from "../../assets/images/user.png";

function UserInfoCard({ compact = false }) {
  return (
    <div className={`user-info ${compact ? "compact" : ""}`}>
      
      <div className="user-details">
        
      </div>
    </div>
  );
}

export default UserInfoCard;