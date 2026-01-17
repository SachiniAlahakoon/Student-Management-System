import React from "react";
import "./Notices.css";
import NotificationCard from "../../components/NotificationCard/NotificationCard";

function Notices() {
  return (
    <div className="contentArea">
      <header className="heading">
        <h1>Notices</h1>
      </header>
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
