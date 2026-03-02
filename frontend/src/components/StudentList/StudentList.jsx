import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTeacherClass } from "../../context/TeacherClassContext";
import { API_BASE } from "../../api/config";

const StudentList = () => {
  const { activeClassId, loading: classLoading } = useTeacherClass();
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [notificationQueue, setNotificationQueue] = useState([]);

  useEffect(() => {
    if (!activeClassId || classLoading) return;
    fetchStudents();
  }, [activeClassId, classLoading]);

  // Toast queue
  const enqueueToast = ({ type, message }) => {
    setNotificationQueue((prev) => [...prev, { type, message }]);
  };

  useEffect(() => {
    if (notificationQueue.length > 0) {
      const notif = notificationQueue[0];
      switch (notif.type) {
        case "success":
          toast.success(notif.message);
          break;
        case "error":
          toast.error(notif.message);
          break;
        case "warning":
          toast.warning(notif.message);
          break;
        case "info":
          toast.info(notif.message);
          break;
        default:
          toast(notif.message);
      }
      setNotificationQueue((prev) => prev.slice(1));
    }
  }, [notificationQueue]);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${API_BASE}/api/teacher/class-students?classId=${activeClassId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassInfo({
        class_id: res.data.class_id,
        class_name: res.data.class_name,
      });
      setStudents(res.data.students || []);
    } catch (err) {
      console.error("fetchStudents error:", err);
      enqueueToast({ type: "error", message: "Failed to load students" });
    } finally {
      setLoading(false);
    }
  };

  if (loading || classLoading) return <div>Loading students...</div>;

  return (
    <div className="attendance-section">
      <h2>Student List - {classInfo.class_name}</h2>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>First</th>
            <th>Last</th>
            <th>Reg No</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((s) => (
              <tr key={s.student_id}>
                <td>{s.student_id}</td>
                <td>{s.student_firstname}</td>
                <td>{s.student_lastname}</td>
                <td>{s.reg_no}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: "center" }}>
                No students found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentList;
