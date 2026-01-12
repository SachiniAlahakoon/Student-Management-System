import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // Add this import
import "react-toastify/dist/ReactToastify.css"; // Add this import
import Login from "./pages/Login/Login";
import { useEffect } from "react";
import { getTheme, setTheme } from "./utils/theme";
import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import Notices from "./pages/Notices/Notices";
import Profile from "./pages/Profile/Profile";
import Settings from "./pages/Settings/Settings";
import Attendance from "./pages/Attendance/Attendance";

export default function App() {
  useEffect(() => {
    const isDark = getTheme();
    setTheme(isDark);
  }, []);
  
  return (
    <>
      {/* ToastContainer should be at the root level */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <Router>
        <Routes>
          <Route path="/" element={<SplashScreen />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />}>
            <Route path="exam-results" element={<ExamResults />} />
            <Route path="notices" element={<Notices />} />
            <Route path="profile" element={<Profile />} />
            <Route path="settings" element={<Settings />} />
            <Route path="attendance" element={<Attendance/>}/>
          </Route>
        </Routes>
      </Router>
    </>
  );
}