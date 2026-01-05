// frontend/src/pages/TeProfile/TeProfile.jsx
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
import moment from "moment";

import { API_BASE } from "../../api/config";
import "./TeProfile.css"; 

function TeProfile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  // temporary hardcoded teacher id for testing
  const teacherId = 1;

  useEffect(() => {
    fetch(`${API_BASE}/api/teachers/${teacherId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unable to load teacher profile");
        return res.json();
      })
      .then((data) => setTeacher(data))
      .catch((err) => setError(err.message));
  }, []);

  const formatDate = (date) => (date ? moment(date).format("YYYY-MM-DD") : "--");

  if (error) return <p className="error-text">{error}</p>;
  if (!teacher) return <p>Loading teacher profile...</p>;

  return (
    <div className="contentArea1">
      {/* Header */}
      <header className="heading1">
        <h1>Teacher Profile</h1>
      </header>

      {/* General Information */}
      <section className="info-card1">
        <h2 className="section-title1">GENERAL INFORMATION</h2>
        <div className="general-content1">
          <div className="avatar-circle1">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"
              alt="Teacher"
              className="avatar-img1"
            />
          </div>

          <div className="details-list1">
            <div className="detail-item1">
              <span className="detail-label1"><PersonIcon /> NAME</span>
              <span className="detail-value1">{teacher.name}</span>
            </div>
            <div className="detail-item1">
              <span className="detail-label1"><BadgeIcon /> TEACHER ID</span>
              <span className="detail-value1">{teacher.id_no}</span>
            </div>
            <div className="detail-item1">
              <span className="detail-label1"><CalendarMonthIcon /> BIRTHDAY</span>
              <span className="detail-value1">{formatDate(teacher.birthday)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information */}
      <section className="info-card1">
        <h2 className="section-title1">PROFESSIONAL INFORMATION</h2>
        <div className="emergency-content1">
          <div className="detail-item1">
            <span className="detail-label1"><MenuBookIcon /> SUBJECT(S) TAUGHT</span>
            <span className="detail-value1">{teacher.subject_taught}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><GroupsIcon /> CLASS(S) HANDLED</span>
            <span className="detail-value1">{teacher.class_handle}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><BusinessCenterIcon /> YEARS OF EXPERIENCE</span>
            <span className="detail-value1">{teacher.years_experience}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><WorkspacePremiumSharpIcon /> QUALIFICATIONS</span>
            <span className="detail-value1">{teacher.qualification}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><CoPresentIcon /> CURRENT DESIGNATION</span>
            <span className="detail-value1">{teacher.current_role}</span>
          </div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="info-card1">
        <h2 className="section-title1">CONTACT INFORMATION</h2>
        <div className="emergency-content1">
          <div className="detail-item1">
            <span className="detail-label1"><PhoneIcon /> PHONE NUMBER</span>
            <span className="detail-value1">{teacher.phone || "--"}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><EmailIcon /> EMAIL ADDRESS</span>
            <span className="detail-value1">{teacher.email || "--"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeProfile;



/*import { useEffect, useState } from "react";
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
import moment from "moment";
import axios from "axios";

import { API_BASE } from "../../api/config";
import "./TeProfile.css"; 

function TeProfile() {
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      axios.get(`${API_BASE}/api/teachers/user/${userId}`)
        .then(res => setTeacher(res.data))
        .catch(err => console.error("Error loading profile", err));
    }
  }, []);

  if (!teacher) return <div>Loading Profile...</div>;
  const formatDate = (date) => (date ? moment(date).format("YYYY-MM-DD") : "--");


  return (
    <div className="contentArea1">
      {/* Header 
      <header className="heading1">
        <h1>Teacher Profile</h1>
      </header>

      {/* General Information 
      <section className="info-card1">
        <h2 className="section-title1">GENERAL INFORMATION</h2>
        <div className="general-content1">
          <div className="avatar-circle1">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher"
              alt="Teacher"
              className="avatar-img1"
            />
          </div>

          <div className="details-list1">
            <div className="detail-item1">
              <span className="detail-label1"><PersonIcon /> NAME</span>
              <span className="detail-value1">{teacher.name}</span>
            </div>
            <div className="detail-item1">
              <span className="detail-label1"><BadgeIcon /> TEACHER ID</span>
              <span className="detail-value1">{teacher.id_no}</span>
            </div>
            <div className="detail-item1">
              <span className="detail-label1"><CalendarMonthIcon /> BIRTHDAY</span>
              <span className="detail-value1">{formatDate(teacher.birthday)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Information 
      <section className="info-card1">
        <h2 className="section-title1">PROFESSIONAL INFORMATION</h2>
        <div className="emergency-content1">
          <div className="detail-item1">
            <span className="detail-label1"><MenuBookIcon /> SUBJECT(S) TAUGHT</span>
            <span className="detail-value1">{teacher.subject_taught}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><GroupsIcon /> CLASS(S) HANDLED</span>
            <span className="detail-value1">{teacher.class_handle}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><BusinessCenterIcon /> YEARS OF EXPERIENCE</span>
            <span className="detail-value1">{teacher.years_experience}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><WorkspacePremiumSharpIcon /> QUALIFICATIONS</span>
            <span className="detail-value1">{teacher.qualification}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><CoPresentIcon /> CURRENT DESIGNATION</span>
            <span className="detail-value1">{teacher.current_role}</span>
          </div>
        </div>
      </section>

      {/* Contact Information 
      <section className="info-card1">
        <h2 className="section-title1">CONTACT INFORMATION</h2>
        <div className="emergency-content1">
          <div className="detail-item1">
            <span className="detail-label1"><PhoneIcon /> PHONE NUMBER</span>
            <span className="detail-value1">{teacher.phone || "--"}</span>
          </div>
          <div className="detail-item1">
            <span className="detail-label1"><EmailIcon /> EMAIL ADDRESS</span>
            <span className="detail-value1">{teacher.email || "--"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeProfile;

/*import { useEffect, useState } from "react";
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
import moment from "moment";
import { API_BASE } from "../../api/config";
import "./TeProfile.css";

function TeProfile() {
  const [teacher, setTeacher] = useState(null);
  const [error, setError] = useState("");

  const formatDate = (date) =>
    date ? moment(date).format("YYYY-MM-DD") : "--";

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE}/api/profile/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load profile");
        return res.json();
      })
      .then((data) => setTeacher(data))
      .catch((err) => setError(err.message));
  }, []);

  if (error) return <p className="error-text">{error}</p>;
  if (!teacher) return <p>Loading teacher profile...</p>;

  return (
    <div className="contentArea1">
      <header className="heading1">
        <h1>Teacher Profile</h1>
      </header>

      {/* GENERAL 
      <section className="info-card1">
        <h2 className="section-title1">GENERAL INFORMATION</h2>

        <div className="general-content1">
          <div className="avatar-circle1">
            <img
              src={teacher.profile_pic || "https://api.dicebear.com/7.x/avataaars/svg"}
              alt="Teacher"
              className="avatar-img1"
            />
          </div>

          <div className="details-list1">
            <div className="detail-item1">
              <span className="detail-label1"><PersonIcon /> NAME</span>
              <span className="detail-value1">{teacher.name}</span>
            </div>

            <div className="detail-item1">
              <span className="detail-label1"><BadgeIcon /> TEACHER ID</span>
              <span className="detail-value1">{teacher.id_no}</span>
            </div>

            <div className="detail-item1">
              <span className="detail-label1"><CalendarMonthIcon /> BIRTHDAY</span>
              <span className="detail-value1">{formatDate(teacher.birthday)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* PROFESSIONAL 
      <section className="info-card1">
        <h2 className="section-title1">PROFESSIONAL INFORMATION</h2>

        <div className="emergency-content1">
          <div className="detail-item1">
            <span className="detail-label1"><MenuBookIcon /> SUBJECTS</span>
            <span className="detail-value1">{teacher.subject_taught}</span>
          </div>

          <div className="detail-item1">
            <span className="detail-label1"><GroupsIcon /> CLASSES</span>
            <span className="detail-value1">{teacher.class_handled}</span>
          </div>

          <div className="detail-item1">
            <span className="detail-label1"><BusinessCenterIcon /> EXPERIENCE</span>
            <span className="detail-value1">
              {teacher.years_experience} years
            </span>
          </div>

          <div className="detail-item1">
            <span className="detail-label1"><WorkspacePremiumSharpIcon /> QUALIFICATION</span>
            <span className="detail-value1">{teacher.qualification}</span>
          </div>

          <div className="detail-item1">
            <span className="detail-label1"><CoPresentIcon /> DESIGNATION</span>
            <span className="detail-value1">{teacher.current_role}</span>
          </div>
        </div>
      </section>

      {/* CONTACT 
      <section className="info-card1">
        <h2 className="section-title1">CONTACT INFORMATION</h2>

        <div className="emergency-content1">
          <div className="detail-item1">
            <span className="detail-label1"><PhoneIcon /> PHONE</span>
            <span className="detail-value1">{teacher.phone || "--"}</span>
          </div>

          <div className="detail-item1">
            <span className="detail-label1"><EmailIcon /> EMAIL</span>
            <span className="detail-value1">{teacher.email || "--"}</span>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TeProfile;*/
