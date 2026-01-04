import { Outlet } from "react-router-dom";
import TopBar from "../../components/TopBar/TopBar";
import SideBar from "../../components/SideBar/SideBar";
import "./Dashboard.css";

export default function AdminDashboard() {
  return (
    <div className="dashboard">
      <SideBar />
      <div className="dashboard-main">
        <Outlet />  
      </div>
    </div>
  );
}

