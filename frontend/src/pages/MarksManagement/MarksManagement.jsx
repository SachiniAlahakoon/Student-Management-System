import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MarksManagement.css";

export default function MarksManagement() {
  const teacherId = 1; // TEMP

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [students, setStudents] = useState([]);
  const [marksData, setMarksData] = useState([]);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTerm, setSelectedTerm] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  const [isAddEnabled, setIsAddEnabled] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [showYearSelect, setShowYearSelect] = useState(false);

  /* =Fetch classes */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/teacher/classes/${teacherId}`)
      .then((res) => setClasses(res.data))
      .catch((err) => console.error(err));
  }, []);

  /* Fetch subjects */
  useEffect(() => {
    if (!selectedClass) return;

    axios
      .get(
        `http://localhost:5000/api/teacher/subjects/${teacherId}/${selectedClass}`
      )
      .then((res) => setSubjects(res.data))
      .catch((err) => console.error(err));
  }, [selectedClass]);

  /* Fetch years for report generation */
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reports/years")
      .then((res) => setAvailableYears(res.data))
      .catch((err) => console.error("Failed to fetch years:", err));
  }, []);

  /* Enable buttons */
  useEffect(() => {
    setIsAddEnabled(
      selectedClass !== "" && selectedSubject !== "" && selectedTerm !== ""
    );
  }, [selectedClass, selectedSubject, selectedTerm]);

  /* Load marks */
  const loadMarks = async (isView) => {
    setShowYearSelect(false);
    setReportMode(false);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/teacher/marks/${selectedClass}/${selectedSubject}/${selectedTerm}`
      );

      const formatted = res.data.map((s) => ({
        ...s,
        marks: s.marks ?? "",
        isNA: s.marks === null,
      }));

      setStudents(formatted);
      setMarksData(formatted);
      setViewMode(isView);
    } catch (err) {
      console.error(err);
      alert("Failed to load marks");
    }
  };

  /* Load class report */
  const loadReport = async (year) => {
    if (!year) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/class-wise?class_id=${selectedClass}&subject_id=${selectedSubject}&term=${selectedTerm}&year=${year}`
      );

      const data = res.data.map((s) => ({
        ...s,
        marks: s.marks ?? "Not Entered",
        grade: s.grade ?? "-",
      }));

      setReportData(data);
      setReportMode(true);
      setStudents([]); // clear marks table
      setMarksData([]); // clear marks table
    } catch (err) {
      console.error(err);
      alert("Failed to load class report");
    }
  };

  /* Handlers */
  const handleMarkChange = (index, value) => {
    const updated = [...marksData];
    updated[index].marks = value;
    setMarksData(updated);
  };

  const handleToggleNA = (index) => {
    const updated = [...marksData];
    updated[index].isNA = !updated[index].isNA;
    if (updated[index].isNA) updated[index].marks = "";
    setMarksData(updated);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        class_id: selectedClass,
        subject_id: selectedSubject,
        term: selectedTerm,
        marks: marksData.map((s) => ({
          student_id: s.student_id,
          marks: s.isNA ? null : parseInt(s.marks),
          year: new Date().getFullYear(),
        })),
      };

      await axios.post("http://localhost:5000/api/teacher/marks/add", payload);
      alert("Marks saved successfully");
      setStudents([]);
      setMarksData([]);
    } catch (err) {
      console.error(err);
      alert("Failed to submit marks");
    }
  };

  const handleDeleteMarks = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete all marks for this selection?"
      )
    )
      return;

    try {
      await axios.post("http://localhost:5000/api/teacher/marks/delete", {
        class_id: selectedClass,
        subject_id: selectedSubject,
        term: selectedTerm,
      });

      alert("Marks deleted");
      setStudents([]);
      setMarksData([]);
    } catch (err) {
      console.error(err);
      alert("Failed to delete marks");
    }
  };

  const handleClear = () => {
    const cleared = marksData.map((s) => ({
      ...s,
      marks: "",
      isNA: false,
    }));
    setMarksData(cleared);
  };

  /* User Interface */
  return (
    <div className="contentArea">
      <h1>Student Marks Management</h1>

      <div className="input-groups">
        <div className="input-group">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
          >
            <option value="">Select Class</option>
            {classes.map((c) => (
              <option key={c.class_id} value={c.class_id}>
                {c.class_name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={!selectedClass}
          >
            <option value="">Select Subject</option>
            {subjects.map((s) => (
              <option key={s.subject_id} value={s.subject_id}>
                {s.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="input-group">
          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value)}
            disabled={!selectedSubject}
          >
            <option value="">Select Term</option>
            <option value="1st">1st</option>
            <option value="2nd">2nd</option>
            <option value="3rd">3rd</option>
          </select>
        </div>
      </div>
      <div className="input-groups">
        <div className="input-group">
          <button className="action-btns"
            disabled={!isAddEnabled}
            onClick={() => {
              loadMarks(true);
              setShowYearSelect(false);
            }}
          >
            View Marks
          </button>
        </div>
        <div className="input-group">
          <button className="action-btns"
            disabled={!isAddEnabled}
            onClick={() => {
              loadMarks(false);
              setShowYearSelect(false);
            }}
          >
            Add / Update Marks
          </button>
        </div>

        <div className="input-group">
          <button className="action-btns" disabled={!isAddEnabled} onClick={handleDeleteMarks}>
            Delete Marks
          </button>
        </div>

        <div className="input-group">
          <button className="action-btns"
            disabled={!isAddEnabled}
            onClick={() => {
              setStudents([]); // clear marks table
              setMarksData([]); // clear marks table
              setViewMode(false);
              setReportMode(false);
              setShowYearSelect(true); // show year select dropdown
            }}
          >
            View Class Report
          </button>
        </div>

        <div className="input-group">
          {showYearSelect && (
            <select
              value={selectedYear}
              onChange={(e) => {
                setSelectedYear(e.target.value);
                loadReport(e.target.value);
              }}
            >
              <option value="">Select Year</option>
              {availableYears.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table - result */}
      {students.length > 0 && (
        <>
          <table className="results-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Marks</th>
                <th>N/A</th>
              </tr>
            </thead>
            <tbody>
              {marksData.map((s, i) => (
                <tr key={s.student_id}>
                  <td>{s.student_name}</td>
                  <td>
                    <input
                      type="number"
                      value={s.marks}
                      disabled={viewMode || s.isNA}
                      onChange={(e) => handleMarkChange(i, e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="checkbox"
                      checked={s.isNA}
                      disabled={viewMode}
                      onChange={() => handleToggleNA(i)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!viewMode && (
            <div className="bottom-btn-row">
              <button onClick={handleSubmit}>Submit</button>
              <button onClick={handleClear}>Clear</button>
            </div>
          )}
        </>
      )}

      {/* Table - report */}
      {reportMode && reportData.length > 0 && (
        <table className="results-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Marks</th>
              <th>Grade</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((s) => (
              <tr key={s.student_id}>
                <td>{s.student_name}</td>
                <td>{s.marks}</td>
                <td>{s.grade}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
