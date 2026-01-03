import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import "./MarksManagement.css";
import MarksTable from "../../components/MarksTable/MarksTable";

const teacherId = 1; // TEMP

/* -------------------- FORM REDUCER -------------------- */

const initialForm = {
  classId: "",
  subjectId: "",
  term: "",
  year: "",
};

function formReducer(state, action) {
  switch (action.type) {
    case "SET_CLASS":
      return { ...state, classId: action.payload, subjectId: "", term: "" };

    case "SET_SUBJECT":
      return { ...state, subjectId: action.payload, term: "" };

    case "SET_TERM":
      return { ...state, term: action.payload };

    case "SET_YEAR":
      return { ...state, year: action.payload };

    case "RESET":
      return initialForm;

    default:
      return state;
  }
}

/* -------------------- COMPONENT -------------------- */

export default function MarksManagement() {
  const [form, dispatch] = useReducer(formReducer, initialForm);

  /* Server state */
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  /* UI state */
  const [marksData, setMarksData] = useState([]);
  const [viewMode, setViewMode] = useState(false);
  const [reportMode, setReportMode] = useState(false);
  const [reportData, setReportData] = useState([]);
  const [showYearSelect, setShowYearSelect] = useState(false);

  /* -------------------- FETCH DATA -------------------- */

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/teacher/classes/${teacherId}`)
      .then((res) => setClasses(res.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!form.classId) return;

    axios
      .get(
        `http://localhost:5000/api/teacher/subjects/${teacherId}/${form.classId}`
      )
      .then((res) => setSubjects(res.data))
      .catch(console.error);
  }, [form.classId]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reports/years")
      .then((res) => setAvailableYears(res.data))
      .catch(console.error);
  }, []);

  /* -------------------- DERIVED STATE -------------------- */

  const isActionEnabled = form.classId && form.subjectId && form.term;

  /* -------------------- ACTIONS -------------------- */

  const loadMarks = async (isView) => {
    setReportMode(false);
    setShowYearSelect(false);

    try {
      const res = await axios.get(
        `http://localhost:5000/api/teacher/marks/${form.classId}/${form.subjectId}/${form.term}`
      );

      const formatted = res.data.map((s) => ({
        ...s,
        marks: s.marks ?? "",
        isNA: s.marks === null,
      }));

      setMarksData(formatted);
      setViewMode(isView);
    } catch {
      alert("Failed to load marks");
    }
  };

  const loadReport = async (year) => {
    if (!year) return;

    try {
      const res = await axios.get(
        `http://localhost:5000/api/reports/class-wise`,
        {
          params: {
            class_id: form.classId,
            subject_id: form.subjectId,
            term: form.term,
            year,
          },
        }
      );

      setReportData(
        res.data.map((s) => ({
          ...s,
          marks: s.marks ?? "Not Entered",
          grade: s.grade ?? "-",
        }))
      );

      setReportMode(true);
      setMarksData([]);
    } catch {
      alert("Failed to load report");
    }
  };

  /* -------------------- MARK HANDLERS -------------------- */

  const handleMarkChange = (index, value) => {
    const updated = [...marksData];
    updated[index].marks = value;
    setMarksData(updated);
  };

  const toggleNA = (index) => {
    const updated = [...marksData];
    updated[index].isNA = !updated[index].isNA;
    updated[index].marks = updated[index].isNA ? "" : updated[index].marks;
    setMarksData(updated);
  };

  const submitMarks = async () => {
    try {
      await axios.post("http://localhost:5000/api/teacher/marks/add", {
        class_id: form.classId,
        subject_id: form.subjectId,
        term: form.term,
        marks: marksData.map((s) => ({
          student_id: s.student_id,
          marks: s.isNA ? null : Number(s.marks),
          year: new Date().getFullYear(),
        })),
      });

      alert("Marks saved successfully");
      setMarksData([]);
    } catch {
      alert("Failed to submit marks");
    }
  };

  /* -------------------- UI -------------------- */

  return (
    <div className="contentArea">
      <MarksTable
        filters={{ class_id: 1, subject_id: 1, term: "1st", year: 2025 }}
      />
    </div>

    //   <div className="contentArea">
    //     <h1>Student Marks Management</h1>

    //     <div className="input-groups">
    //       <select value={form.classId} onChange={e =>
    //         dispatch({ type: "SET_CLASS", payload: e.target.value })
    //       }>
    //         <option value="">Select Class</option>
    //         {classes.map(c => (
    //           <option key={c.class_id} value={c.class_id}>
    //             {c.class_name}
    //           </option>
    //         ))}
    //       </select>

    //       <select
    //         value={form.subjectId}
    //         disabled={!form.classId}
    //         onChange={e =>
    //           dispatch({ type: "SET_SUBJECT", payload: e.target.value })
    //         }
    //       >
    //         <option value="">Select Subject</option>
    //         {subjects.map(s => (
    //           <option key={s.subject_id} value={s.subject_id}>
    //             {s.subject_name}
    //           </option>
    //         ))}
    //       </select>

    //       <select
    //         value={form.term}
    //         disabled={!form.subjectId}
    //         onChange={e =>
    //           dispatch({ type: "SET_TERM", payload: e.target.value })
    //         }
    //       >
    //         <option value="">Select Term</option>
    //         <option value="1st">1st</option>
    //         <option value="2nd">2nd</option>
    //         <option value="3rd">3rd</option>
    //       </select>
    //     </div>

    //     <div className="input-groups">
    //       <button disabled={!isActionEnabled} onClick={() => loadMarks(true)}>
    //         View Marks
    //       </button>

    //       <button disabled={!isActionEnabled} onClick={() => loadMarks(false)}>
    //         Add / Update Marks
    //       </button>

    //       <button
    //         disabled={!isActionEnabled}
    //         onClick={() => setShowYearSelect(true)}
    //       >
    //         View Class Report
    //       </button>

    //       {showYearSelect && (
    //         <select
    //           value={form.year}
    //           onChange={e => {
    //             dispatch({ type: "SET_YEAR", payload: e.target.value });
    //             loadReport(e.target.value);
    //           }}
    //         >
    //           <option value="">Select Year</option>
    //           {availableYears.map(y => (
    //             <option key={y} value={y}>{y}</option>
    //           ))}
    //         </select>
    //       )}
    //     </div>

    //     {/* MARKS TABLE */}
    //     {marksData.length > 0 && (
    //       <>
    //         <table className="results-table">
    //           <thead>
    //             <tr>
    //               <th>Student</th>
    //               <th>Marks</th>
    //               <th>N/A</th>
    //             </tr>
    //           </thead>
    //           <tbody>
    //             {marksData.map((s, i) => (
    //               <tr key={s.student_id}>
    //                 <td>{s.student_name}</td>
    //                 <td>
    //                   <input
    //                     type="number"
    //                     disabled={viewMode || s.isNA}
    //                     value={s.marks}
    //                     onChange={e => handleMarkChange(i, e.target.value)}
    //                   />
    //                 </td>
    //                 <td>
    //                   <input
    //                     type="checkbox"
    //                     checked={s.isNA}
    //                     disabled={viewMode}
    //                     onChange={() => toggleNA(i)}
    //                   />
    //                 </td>
    //               </tr>
    //             ))}
    //           </tbody>
    //         </table>

    //         {!viewMode && (
    //           <div className="bottom-btn-row">
    //             <button onClick={submitMarks}>Submit</button>
    //             <button onClick={() =>
    //               setMarksData(marksData.map(s => ({ ...s, marks: "", isNA: false })))
    //             }>
    //               Clear
    //             </button>
    //           </div>
    //         )}
    //       </>
    //     )}

    //     {/* REPORT TABLE */}
    //     {reportMode && reportData.length > 0 && (
    //       <table className="results-table">
    //         <thead>
    //           <tr>
    //             <th>Student</th>
    //             <th>Marks</th>
    //             <th>Grade</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {reportData.map(s => (
    //             <tr key={s.student_id}>
    //               <td>{s.student_name}</td>
    //               <td>{s.marks}</td>
    //               <td>{s.grade}</td>
    //             </tr>
    //           ))}
    //         </tbody>
    //       </table>
    //     )}
    //   </div>
  );
}
