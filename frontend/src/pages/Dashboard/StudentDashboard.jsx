import { Outlet } from "react-router-dom";
import SideBar from "../../components/SideBar/SideBar";
import "./Dashboard.css";

function StudentDashboard() {
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard-main">
        <Outlet />  
      </div>
    </div>
  );
}

export default StudentDashboard;
