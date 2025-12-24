import React from "react";
import "./styles/Notices.css";
import NotificationCard from "../../components/NotificationCard";

function Notices() {
  return (
    <div className="contentArea">
      <div className="heading">
        <h1>Notices</h1>
      </div>
      <div>
        <div className="notify-filter">
          <label htmlFor="">All</label>
          <label htmlFor="">Unread</label>
          <label htmlFor="">Read</label>
        </div>
        <div className="notices-container">
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
          <NotificationCard />
        </div>
      </div>
    </div>
  );
}

export default Notices;
