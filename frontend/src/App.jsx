import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import Profile from "./pages/Profile/Profile";
import MarksManagement from "./pages/MarksManagement/MarksManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard/student"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["student"]}>
                <Dashboard />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="s-profile" element={<StProfile />} />
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notices" element={<Notices />} />
        </Route>

        <Route
          path="/dashboard/teacher"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["teacher"]}>
                <Dashboard />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route path="t-profile" element={<TeProfile />} />
          <Route path="attendance-manage" element={<div>Attendance Page</div>} />
          <Route path="marks-management" element={<MarksManagement />} />
          <Route path="notices" element={<Notices />} />
        </Route>
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Router>
  );
}
