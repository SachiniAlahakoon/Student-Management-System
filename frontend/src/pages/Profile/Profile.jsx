import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SchoolIcon from "@mui/icons-material/School";
import BloodtypeIcon from "@mui/icons-material/Bloodtype";
import FavoriteIcon from "@mui/icons-material/Favorite";
import PhoneIcon from "@mui/icons-material/Phone";
import "./Profile.css";

function Profile() {
  return (
    <div className="contentArea">
      {/* Header Section */}
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
                /* Replace this URL with {studentAvatar} if using a local file */
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Annie&clothingColor=3d5afe&hairColor=4a312c&skinColor=edb98a"
                alt="Student"
                className="avatar-img"
              />
            </div>
          </div>

          <div className="details-list">
            <div className="detail-item">
              <span className="detail-label">
                <PersonIcon className="icon" /> NAME
              </span>
              <span className="detail-value">N.M. Perera</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <LocationOnIcon className="icon" /> ADDRESS
              </span>
              <span className="detail-value address">
                ###########, ###########
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <BadgeIcon className="icon" /> REGISTRATION NUMBER
              </span>
              <span className="detail-value">9863582</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <CalendarMonthIcon className="icon" /> BIRTHDAY
              </span>
              <span className="detail-value">2020.04.01</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <SchoolIcon className="icon" /> ADMISSION DATE
              </span>
              <span className="detail-value">2020.04.01</span>
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
            <span className="detail-value">O+</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">
              <FavoriteIcon className="icon" /> SPECIAL HEALTH CONDITIONS
            </span>
            <span className="detail-value">None</span>
          </div>
          <div className="detail-item contact-section">
            <span className="detail-label">
              <PhoneIcon className="icon" /> EMERGENCY CONTACTS
            </span>
            <div className="contacts-grid">
              <div className="contact-row">
                <span className="contact-phone">0987654321</span>
                <span className="contact-name">
                  Mrs. Perera <small>(Mother)</small>
                </span>
              </div>
              <div className="contact-row">
                <span className="contact-phone">0123456789</span>
                <span className="contact-name">
                  Mr. Perera <small>(Father)</small>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
