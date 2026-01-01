import { useEffect, useState } from "react";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge"; // Using Badge for Reg No
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIcon from "@mui/icons-material/Phone";
import "./StProfile.css";

function StProfile() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const formatDate = (date) =>
    date ? new Date(date).toISOString().split("T")[0] : "--";

  useEffect(() => {
    fetch("http://localhost:5000/api/students/8569232")
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

      {/* General Information Card */}
      <section className="info-card">
        <h2 className="section-title">GENERAL INFORMATION</h2>
        <div className="general-content">
          <div className="avatar-wrapper">
            <div className="avatar-circle">
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Annie&clothingColor=3d5afe&hairColor=4a312c&skinColor=edb98a"
                alt="Student"
                className="avatar-img"
              />
            </div>
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

      {/* Academic Information Card */}
      <section className="info-card">
        <h2 className="section-title">ACADEMIC INFORMATION</h2>
        <div className="academic-content">
          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon className="icon" /> CURRENT GRADE
            </span>
            <span className="detail-value">{student.current_grade}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon className="icon" /> SECTION
            </span>
            <span className="detail-value">{student.section}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <SchoolIcon className="icon" /> SUBJECT(S) ENROLLED
            </span>
            <div className="subjects-list">
              {student.subjects && student.subjects.length > 0 ? (
                student.subjects.map((subj, idx) => (
                  <span key={idx} className="subject-item">
                    {subj}
                  </span>
                ))
              ) : (
                <span>No subjects enrolled</span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Information Card */}
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
              <FavoriteIcon className="icon" /> SPECIAL HEALTH CONDITIONS
            </span>
            <span className="detail-value">{student.Hcondition || "None"}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <PhoneIcon className="icon" /> EMERGENCY CONTACTS
            </span>
            <div className="contacts-grid">
              {student.contact1 || student.contact2 ? (
                <>
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
                </>
              ) : (
                <p>No contacts available</p>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default StProfile;
