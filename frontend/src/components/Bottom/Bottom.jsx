import React from "react";
import "./Bottom.css";

function Bottom() {
  return (
    <div className="bottom-area">
      <footer>
        <p>
          © {new Date().getFullYear()} Student Management System. All rights
          reserved.
        </p>
      </footer>
    </div>
  );
}

export default Bottom;
