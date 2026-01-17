import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import SplashScreen from "./pages/SplashScreen/SplashScreen";

import Dashboard from "./pages/Dashboard/Dashboard";
import AdminDashboard from "./pages/Dashboard/AdminDashboard";
import StudentDashboard from "./pages/Dashboard/StudentDashboard";
import TeacherDashboard from "./pages/Dashboard/TeacherDashboard";

import AdminHome from "./pages/Admin/AdminHome/AdminHome";
import ManageStudents from "./pages/Admin/ManageStudents/ManageStudents";
import AddStudent from "./pages/Admin/AddStudent/AddStudent";
import ViewStudent from "./pages/Admin/ViewStudent/ViewStudent";
import ManageSubjects from "./pages/Admin/ManageSubjects/ManageSubjects";
import AddSubject from "./pages/Admin/AddSubject/AddSubject";
import ManageTeachers from "./pages/Admin/ManageTeachers/ManageTeachers";
import AddTeacher from "./pages/Admin/AddTeacher/AddTeacher";
import ManageAdmin from "./pages/Admin/ManageAdmin/ManageAdmin";
import AddAdmin from "./pages/Admin/AddAdmin/AddAdmin";

import Attendance from "./pages/Attendance/Attendance";
import MarksManagement from "./pages/MarksManagement/MarksManagement";
import ExamResults from "./pages/ExamResults/ExamResults";
import Notices from "./pages/Notices/Notices";
import Profile from "./pages/Profile/Profile";
import StProfile from "./pages/StProfile/StProfile";
import TeProfile from "./pages/TeProfile/TeProfile";

import ProtectedRoute from "./components/auth/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />

       
        <Route path="/dashboard" element={<Dashboard />}>
          
          
          <Route
            path="admin"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="view-student/:regNo" element={<ViewStudent />} />
            <Route path="manage-subjects" element={<ManageSubjects />} />
            <Route path="add-subject" element={<AddSubject />} />
            <Route path="manage-teachers" element={<ManageTeachers />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="manage-admin" element={<ManageAdmin />} />
            <Route path="add-admin" element={<AddAdmin />} />
          </Route>

          
          <Route
            path="student"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<StProfile />} />

            <Route path="profile" element={<StProfile />} />
            <Route path="exam-results" element={<ExamResults />} />
          </Route>

         
          <Route
            path="teacher"
            element={
              <ProtectedRoute allowedRoles={["teacher"]}>
                <TeacherDashboard />
              </ProtectedRoute>
            }
          >
            <Route index element={<TeProfile />} />
            <Route path="profile" element={<TeProfile />} />
            <Route path="attendance" element={<Attendance />} />
            <Route path="marks" element={<MarksManagement />} />
            <Route path="exam-results" element={<ExamResults />} />
          </Route>

          
          <Route path="notices" element={<Notices />} />
          <Route path="profile" element={<Profile />} />

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
    </BrowserRouter>
  );
}
