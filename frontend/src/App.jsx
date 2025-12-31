import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import Notices from "./pages/Notices/Notices";
import Profile from "./pages/Profile/Profile";
import MarksManagement from "./pages/MarksManagement/MarksManagement";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<Profile />} />
          <Route path="marks-management" element={<MarksManagement />} />
        </Route>
      </Routes>
    </Router>
  );
}
