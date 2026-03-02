import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Login from "./pages/Login/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import SplashScreen from "./pages/SplashScreen/SplashScreen";
import ExamResults from "./pages/ExamResults/ExamResults";
import StProfile from "./pages/StProfile/StProfile";
import TeProfile from "./pages/TeProfile/TeProfiles";
import MarksManagement from "./pages/MarksManagement/MarksManagement";
import AttendanceView from "./pages/AttendanceView/AttendanceView";
import Attendance from "./pages/Attendance/Attendance";
import Forbidden from "./pages/Forbidden/Forbidden";
import RequireAuth from "./components/auth/RequireAuth";
import RequireRole from "./components/auth/RequireRole";
import AdminHome from "./pages/Admin/AdminHome/AdminHome";
import ManageAdmin from "./pages/Admin/ManageAdmin/ManageAdmin";
import AddAdmin from "./pages/Admin/AddAdmin/AddAdmin";
import ManageStudents from "./pages/Admin/ManageStudents/ManageStudents";
import ViewStudent from "./pages/Admin/ViewStudent/ViewStudent";
import AddStudent from "./pages/Admin/AddStudent/AddStudent";
import ManageTeachers from "./pages/Admin/ManageTeachers/ManageTeachers";
import AddTeacher from "./pages/Admin/AddTeacher/AddTeacher";
import ManageSubjects from "./pages/Admin/ManageSubjects/ManageSubjects";
import AddSubject from "./pages/Admin/AddSubject/AddSubject";
import Settings from "./pages/Settings/Settings";

export default function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/login" element={<Login />} />
        <Route path="/403" element={<Forbidden />} />

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
          <Route path="attendance" element={<AttendanceView />} />
          <Route path="settings" element={<Settings />} /> 
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
          <Route path="attendance-manage" element={<Attendance />} />
          <Route path="marks-manage" element={<MarksManagement />} />
          <Route path="settings" element={<Settings />} /> 
        </Route>
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
            <Route index element={<AdminHome />} />
            <Route path="manage-admin" element={<ManageAdmin />} />
            <Route path="/dashboard/admin/add-admin" element={<AddAdmin />} />  
            <Route path="manage-students" element={<ManageStudents />} />
            <Route path="view-student/:regNo" element={<ViewStudent />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="manage-teachers" element={<ManageTeachers />} />
            <Route path="add-teacher" element={<AddTeacher />} />
            <Route path="manage-subjects" element={<ManageSubjects />} />
            <Route path="add-subject" element={<AddSubject />} />
            <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
      
    </Router>
  );
}
