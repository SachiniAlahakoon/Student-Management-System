import { useState, useEffect } from "react";
import axios from "axios";
import "../Attendance.css";

function AttendanceMarking({ selectedClass }) {
  const [students, setStudents] = useState([
    { student_id: 1, name: "Amaya Perera" },
    { student_id: 2, name: "Nethmi Silva" },
    { student_id: 3, name: "Sahan Fernando" },
  ]);

  const [attendance, setAttendance] = useState(
    students.map(() => "Present")
  );
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    setAttendance(students.map(() => "Present"));
  }, [students]);

  const handleStatusChange = (index, value) => {
    const updated = [...attendance];
    updated[index] = value;
    setAttendance(updated);
  };

  const handleMarkAsHoliday = () => {
    setIsHoliday(!isHoliday);
    setAttendance(
      !isHoliday ? students.map(() => "Holiday") : students.map(() => "Present")
    );
  };

  const handleSubmit = async () => {
    const attendanceData = students.map((student, index) => ({
      student_id: student.student_id,
      status: attendance[index],
    }));

    try {
      await axios.post("http://localhost:5000/api/attendance/mark", {
        classId: selectedClass,
        date: new Date().toISOString().split("T")[0],
        attendance: attendanceData,
      });

      alert("Attendance submitted successfully!");

      setAttendance(students.map(() => "Present"));
      setIsHoliday(false);
    } catch (err) {
  if (err.response && err.response.status === 409) {
    alert(err.response.data.message);
  } else {
    alert("Error submitting attendance.");
  }
}

  };

  return (
    <div>
      <h3>{selectedClass} - Mark Attendance</h3>

      <table className="attendanceTable">
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr key={student.student_id}>
              <td>{student.name}</td>
              <td>
                <select
                  value={attendance[index]}
                  onChange={(e) =>
                    handleStatusChange(index, e.target.value)
                  }
                  disabled={isHoliday}
                >
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  {isHoliday && (
                    <option value="Holiday">Holiday</option>
                  )}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="attendanceActions">
        <button className="holiday" onClick={handleMarkAsHoliday}>
          {isHoliday ? "Remove Holiday" : "Mark as Holiday"}
        </button>
        <button className="submit" onClick={handleSubmit}>
          Submit Attendance
        </button>
      </div>
    </div>
  );
}

export default AttendanceMarking;
