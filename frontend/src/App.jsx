import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

        {/* Student dashboard */}
        <Route path="/dashboard/student" element={<Dashboard />}>
          <Route path="s-profile" element={<StProfile />} />
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notices" element={<Notices />} />
        </Route>

        {/* Teacher dashboard */}
        <Route path="/dashboard/teacher" element={<Dashboard />}>
          <Route path="t-profile" element={<TeProfile />} />
          <Route path="attendance-manage" element={<div>Attendance Page</div>} />
          <Route path="marks-manage" element={<div>Marks Page</div>} />
          <Route path="notices" element={<Notices />} />
        </Route>
      </Routes>
    </Router>
  );
}
