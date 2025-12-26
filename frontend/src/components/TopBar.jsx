
import { Link } from 'react-router-dom';
import './styles/TopBar.css';
import logo from '../assets/images/Swarnamali GCK Logo.png'
import userIcon from '../assets/images/user.png'
import settingsIcon from '../assets/images/settings.png'
import sortDownLogo from '../assets/images/sort-down.png'
import { Link } from "react-router-dom";
import './styles/TopBar.css';
import logo from '../assets/images/Swarnamali GCK Logo.png';
import userIcon from '../assets/images/user.png';
import sortDownLogo from '../assets/images/sort-down.png';
import SettingsIcon from '@mui/icons-material/Settings';

function TopBar() {
  return (
    <nav className="top-bar">
        <div className="logo-area">
            <img src={ logo } alt="" className="logo" />
            <Link to="/student-info" className="title">Swarnamali Girls College</Link>
            <Link to="/student/exam-results" className="title">Swarnamali Girls College</Link>
        </div>
        <div className="right-section">
            <div className="user-info">
                <img src={ userIcon } alt="" className="user-icon" />
                <div className="user-details">
                    <span className="user-name">N.M. Perera</span>
                    <span className="user-role">Student</span>
                </div>
                <img src={ sortDownLogo } alt="" className="sort-down-icon" />
            </div>
            <img src={ settingsIcon } alt="" className="settings-icon" />
            <SettingsIcon className="settings-icon" />
        </div>
    </nav>
  )
}

export default TopBar