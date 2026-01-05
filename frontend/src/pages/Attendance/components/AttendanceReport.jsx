import { useState, useEffect } from "react";
import "../Attendance.css";

function AttendanceReport({ selectedClass }) {
  const [period, setPeriod] = useState("daily");
  const [attendanceData, setAttendanceData] = useState([]);

  useEffect(() => {
    // Load attendance data from localStorage
    const records = JSON.parse(localStorage.getItem('attendanceRecords') || '[]');
    const classRecords = records.filter(record => record.class === selectedClass);
    setAttendanceData(classRecords);
  }, [selectedClass]);

  const calculateSummary = () => {
    let totalPresent = 0;
    let totalAbsent = 0;
    let totalLate = 0;
    let holidays = 0;

    attendanceData.forEach(record => {
      if (record.isHoliday) {
        holidays++;
      } else {
        record.attendance.forEach(student => {
          if (student.status === "Present") totalPresent++;
          if (student.status === "Absent") totalAbsent++;
          if (student.status === "Late") totalLate++;
        });
      }
    });

    const totalRecords = attendanceData.length;
    const totalStudents = attendanceData[0]?.attendance.length || 0;
    const totalPossible = totalRecords * totalStudents;

    return {
      totalPresent,
      totalAbsent,
      totalLate,
      holidays,
      totalRecords,
      attendanceRate: totalPossible > 0 ? ((totalPresent + totalLate) / totalPossible * 100).toFixed(1) : 0
    };
  };

  const summary = calculateSummary();

  return (
    <div>
      <h3>{selectedClass} - Attendance Report</h3>

      {/* Report Period Selector */}
      <div className="reportPeriods">
        <button 
          className={period === "daily" ? "active" : ""}
          onClick={() => setPeriod("daily")}
        >
          Daily
        </button>
        <button 
          className={period === "weekly" ? "active" : ""}
          onClick={() => setPeriod("weekly")}
        >
          Weekly
        </button>
        <button 
          className={period === "monthly" ? "active" : ""}
          onClick={() => setPeriod("monthly")}
        >
          Monthly
        </button>
        <button 
          className={period === "yearly" ? "active" : ""}
          onClick={() => setPeriod("yearly")}
        >
          Yearly
        </button>
      </div>

      {/* Summary Cards */}
      <div className="attendanceSummary">
        <div className="summaryCard">
          <h4>Total Present</h4>
          <p>{summary.totalPresent}</p>
        </div>
        <div className="summaryCard">
          <h4>Total Absent</h4>
          <p>{summary.totalAbsent}</p>
        </div>
        <div className="summaryCard">
          <h4>Total Late</h4>
          <p>{summary.totalLate}</p>
        </div>
        <div className="summaryCard">
          <h4>Holidays</h4>
          <p>{summary.holidays}</p>
        </div>
        <div className="summaryCard">
          <h4>Attendance Rate</h4>
          <p>{summary.attendanceRate}%</p>
        </div>
      </div>

      {/* Report Details */}
      <div className="reportBox">
        <h4>Showing <b>{period}</b> attendance report</h4>
        
        {attendanceData.length === 0 ? (
          <p>No attendance records found for {selectedClass}.</p>
        ) : (
          <table className="attendanceTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Marked By</th>
                <th>Status</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.slice(-10).reverse().map((record, index) => (
                <tr key={index}>
                  <td>{record.date}</td>
                  <td>{record.markedBy}</td>
                  <td>{record.isHoliday ? "Holiday" : "Regular"}</td>
                  <td>
                    {record.isHoliday ? (
                      "Holiday - All students marked as Holiday"
                    ) : (
                      `Present: ${record.attendance.filter(s => s.status === "Present").length}, 
                      Absent: ${record.attendance.filter(s => s.status === "Absent").length},
                      Late: ${record.attendance.filter(s => s.status === "Late").length}`
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AttendanceReport;