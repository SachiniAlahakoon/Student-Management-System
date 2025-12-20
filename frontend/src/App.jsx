import TopBar from './components/TopBar.jsx'
import SideBar from './components/SideBar.jsx';
// import StudentDashboard from './pages/StudentDashboard.jsx'
// import AdminDashboard from './pages/AdminDashboard.jsx';
import './App.css'
import { Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
    <div>
      <TopBar />
    </div>
    <div>
      <SideBar />
    </div>
      <main className="react-router-dom">
        {/* <Routes>
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />}/>
        </Routes> */}
      </main>
    </>
  )
}

export default App
