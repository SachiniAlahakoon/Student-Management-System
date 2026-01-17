import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { useTeacherClass } from "../../context/TeacherClassContext";
import { API_BASE } from "../../api/config";

const AttendanceReport = () => {
  const { activeClassId, loading: classLoading } = useTeacherClass();
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("Daily");
  const [classInfo, setClassInfo] = useState({});

  const periodMap = { Daily: "daily", Weekly: "weekly", Monthly: "monthly", Yearly: "yearly" };

  useEffect(() => {
    if (activeClassId) fetchClassInfo();
  }, [activeClassId]);

  useEffect(() => {
    if (activeClassId) fetchReport();
  }, [activeClassId, activeTab]);

  const fetchClassInfo = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        `${API_BASE}/api/teacher/class-students?classId=${activeClassId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setClassInfo({ className: res.data.class_name });
    } catch {
      setClassInfo({});
    }
  };

  const fetchReport = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const period = periodMap[activeTab];

      const res = await axios.get(
        `${API_BASE}/api/teacher/attendance-report?classId=${activeClassId}&period=${period}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setReportData(Array.isArray(res.data) ? res.data : res.data.dailyData || []);
    } catch {
      toast.error("Failed to load attendance report");
    } finally {
      setLoading(false);
    }
  };

  const groupedData = useMemo(() => {
    if (!Array.isArray(reportData)) return [];
    const map = {};
    reportData.forEach((item) => {
      if (!map[item.date]) map[item.date] = { date: item.date, Present: 0, Absent: 0, Late: 0, Holiday: 0 };
      map[item.date][item.status] += item.count;
    });
    return Object.values(map)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .map((row) => {
        const total = row.Present + row.Absent + row.Late;
        const rate = total > 0 ? Math.round((row.Present / total) * 100) : 0;
        return { ...row, rate: `${rate}%` };
      });
  }, [reportData]);

  const summary = groupedData.reduce(
    (acc, row) => {
      acc.Present += row.Present;
      acc.Absent += row.Absent;
      acc.Late += row.Late;
      acc.Holiday += row.Holiday;
      acc.total += row.Present + row.Absent + row.Late + row.Holiday;
      return acc;
    },
    { Present: 0, Absent: 0, Late: 0, Holiday: 0, total: 0 }
  );

  const attendanceRate = summary.total ? Math.round(((summary.Present + summary.Late) / summary.total) * 100) : 0;

  const handleExportPDF = () => {
    if (!groupedData.length) return alert("No data to export");
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`Attendance Report - ${classInfo.className || "Class"}`, 14, 15);
    doc.setFontSize(12);
    doc.text(`Period: ${activeTab}`, 14, 22);

    autoTable(doc, {
      startY: 30,
      head: [["Date", "Present", "Absent", "Late", "Holiday", "Rate"]],
      body: groupedData.map((r) => [r.date, r.Present, r.Absent, r.Late, r.Holiday, r.rate]),
    });

    const y = doc.lastAutoTable.finalY + 10;
    doc.text(`Present: ${summary.Present}`, 14, y);
    doc.text(`Absent: ${summary.Absent}`, 14, y + 6);
    doc.text(`Late: ${summary.Late}`, 14, y + 12);
    doc.text(`Holiday: ${summary.Holiday}`, 14, y + 18);
    doc.text(`Attendance Rate: ${attendanceRate}%`, 14, y + 24);

    doc.save(`Attendance_Report_${classInfo.className || "Class"}_${activeTab}.pdf`);
  };

  if (loading || classLoading) return <div>Loading attendance report...</div>;

  return (
    <div className="attendance-section">
      <h2>Attendance Report - {classInfo.className || "Class"}</h2>

      <div className="report-tabs">
        {Object.keys(periodMap).map((tab) => (
          <button
            key={tab}
            className={`tab-btn ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
        <button className="tab-btn" onClick={handleExportPDF}>
          Export PDF
        </button>
      </div>

      <div className="stats-summary">
        <div className="stat-card present">
          <div className="stat-label">Present</div>
          <div className="stat-value">{summary.Present}</div>
        </div>
        <div className="stat-card absent">
          <div className="stat-label">Absent</div>
          <div className="stat-value">{summary.Absent}</div>
        </div>
        <div className="stat-card late">
          <div className="stat-label">Late</div>
          <div className="stat-value">{summary.Late}</div>
        </div>
        <div className="stat-card holiday">
          <div className="stat-label">Holiday</div>
          <div className="stat-value">{summary.Holiday}</div>
        </div>
        <div className="stat-card rate">
          <div className="stat-label">Attendance Rate</div>
          <div className="stat-value">{attendanceRate}%</div>
        </div>
      </div>

      <div className="table-container">
        <table className="attendance-table report-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Late</th>
              <th>Holiday</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {groupedData.length > 0 ? (
              groupedData.map((row, i) => (
                <tr key={i}>
                  <td>{row.date}</td>
                  <td className="present-cell">{row.Present}</td>
                  <td className="absent-cell">{row.Absent}</td>
                  <td className="late-cell">{row.Late}</td>
                  <td className="holiday-cell">{row.Holiday}</td>
                  <td className="rate-cell">{row.rate}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-row">
                  No attendance records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="table-footer">
          Showing {groupedData.length} {activeTab === "Daily" ? "days" : activeTab.toLowerCase()}
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;
