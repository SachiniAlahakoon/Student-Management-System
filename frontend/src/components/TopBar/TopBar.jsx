import { Link } from "react-router-dom";
import './TopBar.css';
import logo from '../../assets/images/Swarnamali GCK Logo.png';
import SettingsIcon from '@mui/icons-material/Settings';

function TopBar() {
  return (
    <nav className="top-bar">
        <div className="logo-area">
            <img src={ logo } alt="" className="logo" />
            <Link to="/student/exam-results" className="title">Swarnamali Girls College</Link>
        </div>
        <div className="right-section">
            <SettingsIcon className="settings-icon" />
        </div>
    </nav>
  )
}

export default TopBar