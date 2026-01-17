import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SplashScreen.css";

const SplashScreen = () => {
  const [accepted, setAccepted] = useState(false);
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="splash-container">
      <div className="splash-content">
        <img src="/logo.png" alt="College Logo" className="splash-logo" />

        <h1 className="splash-title">SWARNAMALI GIRLS' COLLEGE, KANDY</h1>
        <h2 className="splash-subtitle">Student Management System</h2>

        <div className="terms">
          <input
            type="checkbox"
            checked={accepted}
            onChange={(e) => setAccepted(e.target.checked)}
            id="termsCheckbox"
          />
          <label htmlFor="termsCheckbox">Accept Terms and Conditions</label>
        </div>

        <button
          className="login-button"
          disabled={!accepted}
          onClick={handleLoginClick}
        >
          Already Have an Account?
        </button>
      </div>
    </div>
  );
};

export default SplashScreen;
