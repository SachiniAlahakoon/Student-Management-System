import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";

import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import Notices from "./pages/Notices/Notices";
import Profile from "./pages/Profile/Profile";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";
import ManageStudents from "./pages/Admin/ManageStudents";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />}>
          <Route path="manage-students" element={<ManageStudents />} />
        </Route>
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
