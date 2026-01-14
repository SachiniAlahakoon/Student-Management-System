import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import StProfile from "./pages/StProfile/StProfile";
import TeProfile from "./pages/TeProfile/TeProfile";
import RequireAuth from "./components/auth/RequireAuth";
import RequireRole from "./components/auth/RequireRole";
import Forbidden from "./pages/Forbidden/Forbidden";
//import AttendanceView from "./pages/AttendanceView/AttendanceView";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

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
          <Route path="attendance-view" element={<div>Attendance view Page</div>} />
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
        >
          <Route path="manage-admin" element={<div>Admin page</div>} />
          <Route path="manage-students" element={<div>manage student Page</div>} />
          <Route path="manage-teachers" element={<div>manage teacher Page</div>} />
          <Route path="manage-subjects" element={<div>manage subjects Page</div>} />
        </Route>
      </Routes>
    </Router>
  );
}
