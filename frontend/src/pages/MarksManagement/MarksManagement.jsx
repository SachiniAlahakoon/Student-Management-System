import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import MarksTable from "../../components/MarksTable/MarksTable";

const teacherId = 1; // TEMP

const initialForm = { classId: "", subjectId: "", term: "", year: "" };
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

export default function MarksManagement() {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [loadTable, setLoadTable] = useState(false); // Trigger table load

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

  const isActionEnabled =
    form.classId && form.subjectId && form.term && form.year;

  const handleViewReport = () => {
    if (!isActionEnabled) return;
    setLoadTable(true);
  };

  return (
    <div className="contentArea">
      <header className="heading">
        <h1>Exam Results</h1>
      </header>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        {/* Class select */}
        <TextField
          sx={{ width: 200 }}
          select
          label="Class"
          value={form.classId}
          onChange={(e) =>
            dispatch({ type: "SET_CLASS", payload: e.target.value })
          }
        >
          {classes.map((c) => (
            <MenuItem key={c.class_id} value={c.class_id}>
              {c.class_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Subject select */}
        <TextField
          sx={{ width: 200 }}
          select
          label="Subject"
          value={form.subjectId}
          disabled={!form.classId}
          onChange={(e) =>
            dispatch({ type: "SET_SUBJECT", payload: e.target.value })
          }
        >
          {subjects.map((s) => (
            <MenuItem key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </MenuItem>
          ))}
        </TextField>

        {/* Term select */}
        <TextField
          sx={{ width: 200 }}
          select
          label="Term"
          value={form.term}
          disabled={!form.subjectId}
          onChange={(e) =>
            dispatch({ type: "SET_TERM", payload: e.target.value })
          }
        >
          <MenuItem value="1st">1st</MenuItem>
          <MenuItem value="2nd">2nd</MenuItem>
          <MenuItem value="3rd">3rd</MenuItem>
        </TextField>

        {/* Year select */}
        <TextField
          sx={{ width: 200 }}
          select
          label="Year"
          value={form.year}
          disabled={!form.term}
          onChange={(e) =>
            dispatch({ type: "SET_YEAR", payload: e.target.value })
          }
        >
          {availableYears.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </TextField>

        {/* View Report Button */}
        <Button
          variant="contained"
          color="primary"
          disabled={!isActionEnabled}
          onClick={handleViewReport}
        >
          View Report
        </Button>
      </Box>

      {/* Marks Table */}
      {loadTable && (
        <MarksTable
          classId={form.classId}
          subjectId={form.subjectId}
          term={form.term}
          year={form.year}
        />
      )}
    </div>
  );
}
