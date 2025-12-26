
import React from 'react'
import './styles/SideBar.css'
import { SideBarData } from './SideBarData.jsx'
import LogoutIcon from '@mui/icons-material/Logout';
import { useLocation, useNavigate } from 'react-router-dom';

function SideBar() {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <ul>
        <div className='side-bar'>
            <div className="side-bar-items">
                {SideBarData.map((val, key) => {
                return <li key={key} className='row'
                id={location.pathname == val.link ? "active" : ""} onClick={() => navigate(val.link)}>
                    <div id="icon">
                        {val.icon}
                    </div>
                    <div id="title">
                        {val.title}
                    </div>
                </li>
            })}
            </div>
            <div className="logout">
                <li className='logout-item' onClick={() => alert('Logout works!!!')}> {/* This alert is temporary for logout functionality */}
                    <div id="icon">
                        <LogoutIcon />
                    </div>
                    <div id="title">
                        Logout
                    </div>
                </li>
            </div>
        </div>
    </ul>
  )
}

export default SideBar;
export default SideBar
