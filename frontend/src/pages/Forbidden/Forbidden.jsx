import "./Forbidden.css";
import LockIcon from "@mui/icons-material/Lock";

function Forbidden() {
  return (
    <div className="forbidden-container">
      <LockIcon className="forbidden-icon" />
      <h1>403 – Access Denied</h1>
      <hr />
      <br />
      <p>
        You don’t have permission to access this page.
      </p>
      <a href="/login" className="forbidden-link">
        Go back to Login
      </a>
    </div>
  );
}

export default Forbidden;
