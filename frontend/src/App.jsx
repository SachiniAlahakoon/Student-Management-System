import Profile from "./pages/student/Profile.jsx"
import ExamResults from "./pages/student/ExamResults.jsx";
import Notices from "./pages/student/Notices.jsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import StudentFrame from "./layouts/StudentFrame.jsx";

function App() {
  return (
    <Routes>
      <Route path="/student/*" element={<StudentFrame />}>
        <Route path="profile" element={<Profile />} />
        
        </Route>
        <Route path="exam-results" element={<ExamResults />} />
        <Route path="notices" element={<Notices />} />
      </Route>
    </Routes>
  );
}

export default App;
