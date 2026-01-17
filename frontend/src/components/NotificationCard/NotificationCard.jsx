import React from "react";
import "./NotificationCard.css";

function NotificationCard() {
  return (
    <div className="card">
      <div className="content">
        <div className="card-header-area">
          <h2 className="card-header">Notification Title</h2>
          <span className="received-time">Now</span>
        </div>
        <p className="card-body">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Aliquid
          quasi quibusdam perferendis eaque magnam, laboriosam quod, commodi
          sunt mollitia corporis distinctio? Enim fuga reprehenderit incidunt,
          voluptas consequuntur corrupti velit odit aliquam eveniet expedita
        </p>
      </div>
      <div className="read-btn">
        <label>Mark as Read</label>
      </div>
    </div>
  );
}

export default NotificationCard;
