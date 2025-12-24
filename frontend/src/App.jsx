import ExamResults from "./pages/Student/ExamResults.jsx";
import Notices from "./pages/Student/Notices.jsx";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import StudentFrame from "./layouts/StudentFrame.jsx";

function App() {
  return (
    <Routes>
      <Route path="/student/*" element={<StudentFrame />}>
        <Route path="exam-results" element={<ExamResults />} />
        <Route path="notices" element={<Notices />} />
      </Route>
    </Routes>
  );
}

export default App;
