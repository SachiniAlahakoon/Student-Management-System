import React from 'react'
import Navbar from './Components/Navbar/Navbar'
import Sidebar from './Components/Sidebar/Sidebar'


const App = () => {
  return (
    <div className='container'>
        <Navbar />
        <Sidebar />
    </div>
  )
}

export default App