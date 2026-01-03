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

  // temporary hardcoded student id for testing
  const studentId = 1;

  useEffect(() => {
    fetch(`${API_BASE}/api/students/${studentId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setStudent(data))
      .catch(() => setError("Unable to load student profile"));
  }, []);

  if (error) return <p>{error}</p>;
  if (!student) return <p>Loading...</p>;

  return (
    <div className="contentArea">
      <header className="heading">
        <h1>Student Profile</h1>
      </header>

      {/* General Information */}
      <section className="info-card">
        <h2 className="section-title">GENERAL INFORMATION</h2>

        <div className="general-content">
          <div className="avatar-circle">
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Annie"
              alt="Student"
              className="avatar-img"
            />
          </div>

          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">
                <PersonIcon /> NAME
              </span>
              <span className="detail-value">{student.name}</span>
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
              <SchoolIcon className="icon" /> CURRENT GRADE
            </span>
            <span className="detail-value">
              {student.current_grade || "--"}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon className="icon" /> SECTION
            </span>
            <span className="detail-value">{student.section || "--"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon className="icon" /> SUBJECT(S) ENROLLED
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
              <BloodtypeIcon className="icon" /> BLOOD TYPE
            </span>
            <span className="detail-value">{student.blood_type || "--"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <FavoriteIcon className="icon" /> HEALTH CONDITIONS
            </span>
            <span className="detail-value">{student.Hcondition || "None"}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">
              <PhoneIcon className="icon" /> EMERGENCY CONTACTS
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
