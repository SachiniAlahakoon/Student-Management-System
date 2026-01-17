import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIcon from "@mui/icons-material/Phone";
import "./StProfile.css";
import { API_BASE } from "../../api/config";
import moment from "moment";

function StProfile() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const formatDate = (date) =>
    date ? moment(date).format("YYYY-MM-DD") : "--";

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized. Please log in.");
      return;
    }

    fetch(`${API_BASE}/api/profile/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch profile");
        return res.json();
      })
      .then((data) => setStudent(data))
      .catch(() => setError("Unable to load profile"));
  }, []);

  if (error) return <p className="error">{error}</p>;
  if (!student) return <p>Loading...</p>;

  return (
    <div className="contentArea">
      <header className="mainHeading">
        <h1 className="mainHeading-std">Student Profile</h1>
      </header>

      {/* General Information */}
      <section className="info-card">
        <h2 className="section-title">GENERAL INFORMATION</h2>
        <div className="general-content">
          <div className="avatar-circle">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Student"
              alt="Student"
              className="avatar-img"
            />
          </div>
          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">
                <PersonIcon /> NAME
              </span>
              <span className="detail-value">
                {student.student_firstname} {student.student_lastname}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <LocationOnIcon /> ADDRESS
              </span>
              <span className="detail-value">{student.address}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <BadgeIcon /> REGISTRATION NUMBER
              </span>
              <span className="detail-value">{student.reg_no}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <CalendarMonthIcon /> BIRTHDAY
              </span>
              <span className="detail-value">
                {formatDate(student.birthday)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <SchoolIcon /> ADMISSION DATE
              </span>
              <span className="detail-value">
                {formatDate(student.admission_date)}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Academic Information */}
      <section className="info-card">
        <h2 className="section-title">ACADEMIC INFORMATION</h2>
        <div className="academic-content">
          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon /> CURRENT GRADE
            </span>
            <span className="detail-value">
              {student.current_grade || "--"}
            </span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon /> SECTION
            </span>
            <span className="detail-value">{student.section || "--"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon /> SUBJECT(S) ENROLLED
            </span>
            <div className="subjects-list">
              {student.subjects_en ? (
                student.subjects_en.split(",").map((subj, idx) => (
                  <span key={idx} className="subject-item">
                    {subj.trim()}
                  </span>
                ))
              ) : (
                <span className="detail-value">No subjects enrolled</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Information */}
      <section className="info-card">
        <h2 className="section-title">EMERGENCY INFORMATION</h2>
        <div className="emergency-content">
          <div className="detail-item">
            <span className="detail-label">
              <BloodtypeIcon /> BLOOD TYPE
            </span>
            <span className="detail-value">{student.blood_type || "--"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <FavoriteIcon /> HEALTH CONDITIONS
            </span>
            <span className="detail-value">{student.Hcondition || "None"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <PhoneIcon /> EMERGENCY CONTACTS
            </span>
            <div className="contacts-grid">
              {student.contact1 && (
                <div className="contact-row">
                  <span className="contact-phone">{student.contact1}</span>
                </div>
              )}
              {student.contact2 && (
                <div className="contact-row">
                  <span className="contact-phone">{student.contact2}</span>
                </div>
              )}
              {!student.contact1 && !student.contact2 && (
                <span className="detail-value">No contacts available</span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StProfile;
