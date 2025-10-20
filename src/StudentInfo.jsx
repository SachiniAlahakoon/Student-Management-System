import React from "react";
import { LogOut, User, FileText, Bell } from "lucide-react";

export default function StudentInfo() {
  return (
    <div className="container">
    <header className="top-bar"> 
    <h2 className="school-name">SWARNAMALI GIRLS COLLEGE</h2>
    <div className="profile">
      <div className="avatar"></div>
      <div>
        <p className="student-name">N.M. Perera</p>
        <p className="student-role">Student</p>
      </div>
    </div>
  </header>*/
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="menu">
            <button className="menu-btn">
              <User size={18} /> Profile
            </button>
            <button className="menu-btn">
              <FileText size={18} /> Exam Results
            </button>
            <button className="menu-btn">
              <Bell size={18} /> Notices
            </button>
          </div>
        </div>
        <button className="logout-btn">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="header">
          <h1>STUDENT PROFILE</h1>
          <div className="search-bar">
            <input type="text" placeholder="Enter Student Reg. No" />
            <button>Enter</button>
          </div>
        </div>

        <div className="info-grid">
          {/* General Info */}
          <section className="card">
            <div className="avatar-large"></div>
            <h2>GENERAL INFORMATION</h2>
            <div className="info">
              <p>
                <strong>Name:</strong> --{" "}
              </p>
              <p>
                <strong>Address:</strong> --{" "}
              </p>
              <p>
                <strong>Registration Number:</strong> --{" "}
              </p>
              <p>
                <strong>Birthday:</strong> --
              </p>
              <p>
                <strong>Admission Date:</strong> --
              </p>
            </div>
          </section>
          <div className="info-grid1">
            {/* Emergency Info */}
            <section className="card">
              <h2>EMERGENCY INFORMATION</h2>
              <div className="info">
                <p>
                  <strong>Blood Type:</strong> --
                </p>
                <p>
                  <strong>Special Health Conditions:</strong> --
                </p>
                <div>
                  <p>
                    <strong>Emergency Contacts:</strong>
                  </p>
                  <p>-- (Mother)</p>
                  <p>-- (Father)</p>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
