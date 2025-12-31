import React, { useEffect, useState } from "react";
import axios from "axios";
import "./AttendanceView.css";

export default function AttendanceView() {
  const reg_no = 12345; // TEMP

  const [viewType, setViewType] = useState(""); 
  const [attendance, setAttendance] = useState([]);

  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");

  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Fetch attendance
  useEffect(() => {
    if (!viewType) return;

    let url = `http://localhost:5000/api/attendance/${reg_no}/${viewType}`;

  
    const params = new URLSearchParams();
    if (viewType === "month") {
      if (!selectedYear || !selectedMonth) return;
      params.append("year", selectedYear);
      params.append("month", selectedMonth);
    } else if (viewType === "year") {
      if (!selectedYear) return;
      params.append("year", selectedYear);
    }

    if (params.toString()) url += `?${params.toString()}`;

    axios
      .get(url)
      .then((res) => setAttendance(res.data))
      .catch((err) => {
        console.error("Attendance fetch error", err);
        setAttendance([]);
      });
  }, [viewType, selectedYear, selectedMonth]);

  return (
    <div className="contentArea">
      <header className="heading">
        <h1>My Attendance</h1>
      </header>

      {/* FILTER */}
      <div className="inputArea">
        <div className="input-group">
          <label>View By</label>
          <select
            value={viewType}
            onChange={(e) => {
              setViewType(e.target.value);
              setAttendance([]);
              setSelectedYear("");
              setSelectedMonth("");
            }}
          >
            <option value="">Select View</option>
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
          </select>
        </div>

        {(viewType === "month" || viewType === "year") && (
          <div className="input-group">
            <label>Year</label>
            <input
              type="number"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              placeholder="e.g., 2025"
            />
          </div>
        )}

        {viewType === "month" && (
          <div className="input-group">
            <label>Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={!selectedYear}
            >
              <option value="">Select Month</option>
              {months.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* TABLE */}
      <table className="results-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {attendance.length === 0 ? (
            <tr>
              <td colSpan="2">No attendance records found</td>
            </tr>
          ) : (
            attendance.map((a, i) => (
              <tr key={i}>
                <td>{a.date}</td> {/* Already DATE only from backend */}
                <td className={a.status === "Present" ? "present" : "absent"}>
                  {a.status}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
