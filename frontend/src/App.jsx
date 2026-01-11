/*import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import Notices from "./pages/Notices/Notices";
import StProfile from "./pages/StProfile/StProfile";
import TeProfile from "./pages/TeProfile/TeProfile";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

        {/* Student dashboard 
        <Route path="/dashboard/student" element={<Dashboard />}>
          <Route path="s-profile" element={<StProfile />} />
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notices" element={<Notices />} />
        </Route>

        {/* Teacher dashboard 
        <Route path="/dashboard/teacher" element={<Dashboard />}>
          <Route path="t-profile" element={<TeProfile />} />
          <Route path="attendance-manage" element={<div>Attendance Page</div>} />
          <Route path="marks-manage" element={<div>Marks Page</div>} />
          <Route path="notices" element={<Notices />} />
        </Route>

        {/* Admin dashboard
        <Route path="/dashboard/admin" element={<Dashboard />}>
          
        </Route>
      </Routes>
    </Router>
  );
}*/

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import Notices from "./pages/Notices/Notices";
import StProfile from "./pages/StProfile/StProfile";
import TeProfile from "./pages/TeProfile/TeProfile";
import RequireAuth from "./components/auth/RequireAuth";
import RequireRole from "./components/auth/RequireRole";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

        {/* STUDENT */}
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

        {/* TEACHER */}
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
          <Route path="marks-manage" element={<div>Marks Page</div>} />
          <Route path="notices" element={<Notices />} />
        </Route>

        {/* ADMIN */}
        <Route
          path="/dashboard/admin"
          element={
            <RequireAuth>
              <RequireRole allowedRoles={["admin"]}>
                <Dashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
      </Routes>
    </Router>
  );
}
