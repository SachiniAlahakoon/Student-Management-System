import Header from "./Header";
import ProfileManagement from "./ProfileManagement";
import SubjectManagement from "./SubjectManagement";

export default function AdminDashboard() {
  return (
    <>
      <Header />
      <div className="dashboard">
        <ProfileManagement />
        <SubjectManagement />
        <button className="logout">Logout</button>
      </div>
    </>
  );
}
