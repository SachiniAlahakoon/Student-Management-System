import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import GroupsIcon from "@mui/icons-material/Groups";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import WorkspacePremiumSharpIcon from "@mui/icons-material/WorkspacePremiumSharp";
import EmailIcon from "@mui/icons-material/Email";
import CoPresentIcon from "@mui/icons-material/CoPresent";
import PhoneIcon from "@mui/icons-material/Phone";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";

import "./TeProfile.css";

function Profile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  // temporary hardcoded teacher id for testing
  const teacherId = 2;

  useEffect(() => {
    fetch(`http://localhost:5000/api/teachers/${teacherId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load teacher profile");
        return res.json();
      })
      .then((data) => setTeacher(data))
      .catch((err) => setError(err.message));
  }, []);

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "--";

  if (error) return <p className="error-text">{error}</p>;
  if (!teacher) return <p>Loading teacher profile...</p>;

  return (
    <div className="contentArea">
      {/* Header */}
      <header className="heading">
        <h1>Teacher Profile</h1>
      </header>

      {/* General Information */}
      <section className="info-card">
        <h2 className="section-title">GENERAL INFORMATION</h2>
        <div className="general-content">
          <div className="avatar-wrapper">
            <div className="avatar-circle">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"
                alt="Teacher"
                className="avatar-img"
              />
            </div>
          </div>

          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">
                <PersonIcon className="icon" /> NAME
              </span>
              <span className="detail-value">{teacher.name}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <BadgeIcon className="icon" /> TEACHER ID
              </span>
              <span className="detail-value">{teacher.id_no}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <CalendarMonthIcon className="icon" /> BIRTHDAY
              </span>
              <span className="detail-value">
                {formatDate(teacher.birthday)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information */}
      <section className="info-card">
        <h2 className="section-title">PROFESSIONAL INFORMATION</h2>

        <div className="emergency-content">
          <div className="detail-item">
            <span className="detail-label">
              <MenuBookIcon className="icon" /> SUBJECT(S) TAUGHT
            </span>
            <span className="detail-value">{teacher.subject_taught}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <GroupsIcon className="icon" /> CLASS(S) HANDLED
            </span>
            <span className="detail-value">{teacher.class_handle}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <BusinessCenterIcon className="icon" /> YEARS OF EXPERIENCE
            </span>
            <span className="detail-value">{teacher.y_experince}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <WorkspacePremiumSharpIcon className="icon" /> QUALIFICATIONS
            </span>
            <span className="detail-value">{teacher.quilification}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <CoPresentIcon className="icon" /> CURRENT DESIGNATION
            </span>
            <span className="detail-value">{teacher.current_role}</span>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="info-card">
        <h2 className="section-title">CONTACT INFORMATION</h2>

        <div className="emergency-content">
          <div className="detail-item">
            <span className="detail-label">
              <PhoneIcon className="icon" /> PHONE NUMBER
            </span>
            <span className="detail-value">{teacher.phone}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <EmailIcon className="icon" /> EMAIL ADDRESS
            </span>
            <span className="detail-value">{teacher.email}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
