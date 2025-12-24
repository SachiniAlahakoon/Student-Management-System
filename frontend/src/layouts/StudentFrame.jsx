import { Outlet } from "react-router-dom";
import TopBar from "../components/TopBar";
import SideBar from "../components/SideBar";
import Bottom from "../components/Bottom";
import "./StudentFrame.css";

function StudentFrame() {
  return (
    <div className="student-frame">
      <TopBar />
      <div className="student-content">
        <SideBar />

        <main className="page-area">
          <Outlet />
          {/* this is a placeholder for nested routes. it is helpfull to change page-area dynamically */}
        </main>

        <Bottom />
      </div>
    </div>
  );
}

export default StudentFrame;
