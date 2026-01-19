import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useTeacherClass } from "../../context/TeacherClassContext";
import { API_BASE } from "../../api/config";

const AttendanceMarking = () => {
  const { activeClassId, loading: classLoading } = useTeacherClass();
  const [students, setStudents] = useState([]);
  const [classInfo, setClassInfo] = useState({});
  const [selectedStudents, setSelectedStudents] = useState(new Set());
  const [bulkStatus, setBulkStatus] = useState("Present");
  const [attendanceMarked, setAttendanceMarked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [notificationQueue, setNotificationQueue] = useState([]);

  useEffect(() => {
    if (!activeClassId || classLoading) return;
    loadStudents();
    checkAttendanceStatus();
  }, [activeClassId, classLoading]);

  // Fetch students
  const loadStudents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/teacher/class-students?classId=${activeClassId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setClassInfo({
        classId: res.data.class_id,
        className: res.data.class_name,
      });

      setStudents(
        res.data.students.map((s) => ({ ...s, status: "Present" }))
      );
    } catch (err) {
      console.error("Failed to load students:", err);
      enqueueToast({ type: "error", message: "Failed to load students" });
    } finally {
      setLoading(false);
    }
  };

  // Check student attendance 
  const checkAttendanceStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/teacher/check-today-attendance?classId=${activeClassId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAttendanceMarked(res.data.alreadyMarked);

      if (res.data.alreadyMarked) {
        enqueueToast({ type: "warning", message: "Attendance already submitted today" });
      }
    } catch (err) {
      console.error("Failed to check today's attendance:", err);
      enqueueToast({ type: "error", message: "Failed to check today's attendance" });
    }
  };

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

  // Selection
  const toggleStudent = (id) => {
    const copy = new Set(selectedStudents);
    copy.has(id) ? copy.delete(id) : copy.add(id);
    setSelectedStudents(copy);
  };

  const toggleSelectAll = () => {
    if (selectedStudents.size === students.length) {
      setSelectedStudents(new Set());
    } else {
      setSelectedStudents(new Set(students.map((s) => s.student_id)));
    }
  };

  // Bulk actions
  const markSelected = () => {
    if (selectedStudents.size === 0) {
      enqueueToast({ type: "warning", message: "No students selected" });
      return;
    }
    setStudents((prev) =>
      prev.map((s) =>
        selectedStudents.has(s.student_id)
          ? { ...s, status: bulkStatus }
          : s
      )
    );
    setSelectedStudents(new Set());
  };

  const markHoliday = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Holiday" })));
    enqueueToast({ type: "info", message: "Class marked as Holiday" });
  };

  const resetAll = () => {
    setStudents((prev) => prev.map((s) => ({ ...s, status: "Present" })));
    setSelectedStudents(new Set());
  };

  //Submit attendance
  const submitAttendance = async () => {
    if (attendanceMarked) {
      enqueueToast({ type: "warning", message: "Attendance already submitted today" });
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem("token");
      const today = new Date().toISOString().split("T")[0];

      await axios.post(
        `${API_BASE}/api/teacher/mark-attendance`,
        {
          classId: activeClassId,
          date: today,
          attendance: students.map((s) => ({
            student_id: s.student_id,
            status: s.status,
          })),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      enqueueToast({ type: "success", message: "Attendance submitted successfully" });
      setAttendanceMarked(true);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.alreadyMarked) {
        setAttendanceMarked(true);
        enqueueToast({ type: "warning", message: "Attendance already marked today!" });
      } else {
        enqueueToast({ type: "error", message: "Submission failed" });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Generate count
  const present = students.filter((s) => s.status === "Present").length;
  const absent = students.filter((s) => s.status === "Absent").length;
  const late = students.filter((s) => s.status === "Late").length;

  if (loading || classLoading) return <div>Loading...</div>;

  return (
    <div className="attendance-section">
      <h2>Mark Attendance - {classInfo.className}</h2>

      <div className="top-controls">
        <span>Selected: {selectedStudents.size} students</span>

        <select value={bulkStatus} onChange={(e) => setBulkStatus(e.target.value)}>
          <option value="Present">Present</option>
          <option value="Absent">Absent</option>
          <option value="Late">Late</option>
        </select>

        <button disabled={selectedStudents.size === 0} onClick={markSelected}>
          Mark Selected
        </button>
        <button className="holiday-btn" onClick={markHoliday}>
          Mark as Holiday
        </button>
        <button className="reset-btn" onClick={resetAll}>
          Reset All
        </button>
      </div>

      <table className="attendance-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedStudents.size === students.length}
                onChange={toggleSelectAll}
              />
            </th>
            <th>Student ID</th>
            <th>Student Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((s) => (
            <tr key={s.student_id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedStudents.has(s.student_id)}
                  onChange={() => toggleStudent(s.student_id)}
                />
              </td>
              <td>{s.reg_no}</td>
              <td>{s.student_firstname} {s.student_lastname}</td>
              <td>
                <select
                  value={s.status}
                  onChange={(e) =>
                    setStudents((prev) =>
                      prev.map((st) =>
                        st.student_id === s.student_id
                          ? { ...st, status: e.target.value }
                          : st
                      )
                    )
                  }
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="Holiday">Holiday</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="attendance-footer">
        <span>Present: {present}</span>
        <span>Absent: {absent}</span>
        <span>Late: {late}</span>

        <button disabled={attendanceMarked || submitting} onClick={submitAttendance}>
          {submitting ? "Submitting..." : "Submit Attendance"}
        </button>
      </div>
    </div>
  );
};

export default AttendanceMarking;
