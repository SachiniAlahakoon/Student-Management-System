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
import AddStudent from "./pages/Admin/AddStudent/AddStudent";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageStudents from "./pages/Admin/ManageStudents/ManageStudents";
import ManageSubjects from "./pages/Admin/ManageSubjects/ManageSubjects";
import AddSubject from "./pages/Admin/AddSubject/AddSubject";
import ViewStudent from "./pages/Admin/ViewStudent/ViewStudent";
import ManageTeachers from "./pages/Admin/ManageTeachers/ManageTeachers";
import AddTeacher from "./pages/Admin/AddTeacher/AddTeacher";
import ManageAdmin from "./pages/Admin/ManageAdmin/ManageAdmin";
import ForgotPassword from "./pages/ForgotPassword/ForgotPassword";
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<Dashboard />}>
        <Route path="/dashboard/admin" element={<AdminDashboard />}>
          <Route path="manage-students" element={<ManageStudents />} />
          <Route path="add-student" element={<AddStudent />} />
          <Route path="view-student/:regNo" element={<ViewStudent />} />
          <Route path="manage-subjects" element={<ManageSubjects />} />
          <Route path="add-subject" element={<AddSubject />} />
          <Route path="manage-teachers" element={<ManageTeachers />} />
          <Route path="add-teacher" element={<AddTeacher />} />
        </Route>
        <Route path="/dashboard/admin/manage-admin" element={<ManageAdmin />} />
        <Route path="/dashboard/student" element={<StudentDashboard />} />
        <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
          <Route path="exam-results" element={<ExamResults />} />
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
       {/* ✅ Toast container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </BrowserRouter>
  );
}


