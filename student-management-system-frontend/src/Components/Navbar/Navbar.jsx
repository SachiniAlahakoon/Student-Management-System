import React from 'react'
import './Navbar.css'
import logo from '../../Assets/logo.webp'
import settingsIcon from '../../Assets/settings.png'
import userIcon from '../../Assets/user.png'
import sortDownIcon from '../../Assets/sort-down.png'

const Navbar = () => {
  return (
    <div className='navbar'>
        <div className="logo-area">
            <img src={logo} alt="" className='logo'/>
            <h1 className='title'>Swarnamali Gril's College</h1>
        </div>

        <div className="right-section">
            <div className="user-info">
                <img src={userIcon} alt="" className='user-icon' />
                <div className="user-details">
                    <span className='user-name'>John Doe</span>
                    <span className='user-role'>Student</span>
                </div>
                <img src={sortDownIcon} alt="" className='sort-down-icon'/>
            </div>
            <img src={settingsIcon} alt="" className='settings-icon'/>
        </div>
    </div>
  )
}

export default Navbar