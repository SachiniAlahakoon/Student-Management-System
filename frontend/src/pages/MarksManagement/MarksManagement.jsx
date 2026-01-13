import React, { useEffect, useReducer, useState } from "react";
import axios from "axios";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import MarksTable from "../../components/MarksTable/MarksTable";
import EmptyStateCard from "../../components/EmptyStateCard/EmptyStateCard";
import { API_BASE } from "../../api/config";

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
  const [loadTable, setLoadTable] = useState(false);
  const [error, setError] = useState("");

  // Helper to get Authorization header
  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Fetch teacher's classes
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/teacher/classes`, { headers: getAuthHeader() })
      .then((res) => setClasses(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load classes");
      });
  }, []);

  // Fetch subjects for selected class
  useEffect(() => {
    if (!form.classId) return;
    axios
      .get(`${API_BASE}/api/teacher/subjects/${form.classId}`, {
        headers: getAuthHeader(),
      })
      .then((res) => setSubjects(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load subjects");
      });
  }, [form.classId]);

  // Fetch available years
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/teacher/reports/years`, { headers: getAuthHeader() })
      .then((res) => setAvailableYears(res.data))
      .catch((err) => {
        console.error(err);
        setError("Failed to load available years");
      });
  }, []);

  const isActionEnabled =
    form.classId && form.subjectId && form.term && form.year;

  const handleViewReport = () => {
    if (!isActionEnabled) return;
    setLoadTable(true);
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="contentArea">
      <header className="heading">
        <h1>Marks Management</h1>
      </header>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
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

        <Button
          variant="contained"
          color="primary"
          disabled={!isActionEnabled}
          onClick={handleViewReport}
        >
          View Marksheet
        </Button>
      </Box>

      {!loadTable ? (
        <EmptyStateCard
          message="Select Class, Subject, Term, and Year to view marks"
          height={300}
        />
      ) : (
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
