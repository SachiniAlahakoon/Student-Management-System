import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Button, MenuItem, FormControl, InputLabel, Select } from "@mui/material";
import MarksTable from "../../components/MarksTable/MarksTable";
import EmptyStateCard from "../../components/EmptyStateCard/EmptyStateCard";
import { API_BASE } from "../../api/config";
import './MarksManagement.css'

const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default function MarksManagement() {
  const [classId, setClassId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [term, setTerm] = useState("");
  const [year, setYear] = useState("");

  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);

  const [loadTable, setLoadTable] = useState(false);
  const [error, setError] = useState("");

  /* -------------------- Load Classes -------------------- */
  useEffect(() => {
    axios
      .get(`${API_BASE}/api/teacher/classes`, {
        headers: getAuthHeader(),
      })
      .then((res) => setClasses(res.data))
      .catch(() =>
        setError("Failed to load classes. Are you logged in?")
      );
  }, []);

  /* -------------------- Load Subjects on Class Change -------------------- */
  useEffect(() => {
    if (!classId) return;

    // Reset dependent fields
    setSubjectId("");
    setTerm("");
    setYear("");
    setLoadTable(false);

    axios
      .get(`${API_BASE}/api/teacher/subjects/${classId}`, {
        headers: getAuthHeader(),
      })
      .then((res) => setSubjects(res.data))
      .catch(() => setError("Failed to load subjects"));
  }, [classId]);

  useEffect(() => {
    if (!subjectId) return;

    setTerm("");
    setYear("");
    setLoadTable(false);
  }, [subjectId]);

  useEffect(() => {
    if (!term) return;

    setYear("");
    setLoadTable(false);
  }, [term]);

  useEffect(() => {
    axios
      .get(`${API_BASE}/api/reports/years`, {
        headers: getAuthHeader(),
      })
      .then((res) => setAvailableYears(res.data))
      .catch(() => setError("Failed to load available years"));
  }, []);

  const isActionEnabled = classId && subjectId && term && year;

  const handleViewReport = () => {
    if (!isActionEnabled) return;
    setLoadTable(true);
  };

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="contentArea">
      <header className="mainHeading">
        <h1 className="mainHeading-h1">Marks Management</h1>
      </header>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
      <FormControl className="marks-filter-item" size="small" sx={{ minWidth: 200 }}>
        <InputLabel id="class-label">Class</InputLabel>
        <Select
          labelId="class-label"
          value={classId}
          onChange={(e) => setClassId(e.target.value)}
          label="Class"
        >
          {classes.map((c) => (
            <MenuItem key={c.class_id} value={c.class_id}>
              {c.class_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl
        className="marks-filter-item"
        size="small" sx={{ minWidth: 200 }}
        disabled={!classId}
      >
        <InputLabel id="subject-label">Subject</InputLabel>
        <Select
          labelId="subject-label"
          value={subjectId}
          onChange={(e) => setSubjectId(e.target.value)}
          label="Subject"
        >
          {subjects.map((s) => (
            <MenuItem key={s.subject_id} value={s.subject_id}>
              {s.subject_name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Term */}
      <FormControl
        className="marks-filter-item"
        size="small" sx={{ minWidth: 200 }}
        disabled={!subjectId}
      >
        <InputLabel id="term-label">Term</InputLabel>
        <Select
          labelId="term-label"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          label="Term"
        >
          <MenuItem value="1st">1st</MenuItem>
          <MenuItem value="2nd">2nd</MenuItem>
          <MenuItem value="3rd">3rd</MenuItem>
        </Select>
      </FormControl>

      <FormControl
        className="marks-filter-item"
        size="small" sx={{ minWidth: 200 }}
        disabled={!term}
      >
        <InputLabel id="year-label">Year</InputLabel>
        <Select
          labelId="year-label"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label="Year"
        >
          {availableYears.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

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
          classId={classId}
          subjectId={subjectId}
          term={term}
          year={year}
          getAuthHeader={getAuthHeader}
        />
      )}
    </div>
  );
}
