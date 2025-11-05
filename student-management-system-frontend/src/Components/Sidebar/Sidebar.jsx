import React from 'react'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <nav>
        <ul className="sidebar-list">
          <li className="sidebar-item"> <button className='btn'>Profile</button></li>
          <li className="sidebar-item"> <button>Exam Results</button></li>
          <li className="sidebar-item"> <button>Notices</button></li>
        </ul>
      </nav>
    </aside>
  )
}

export default Sidebar