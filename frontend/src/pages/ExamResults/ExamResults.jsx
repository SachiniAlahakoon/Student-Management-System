import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  InputLabel,
  FormControl,
} from "@mui/material";
import { API_BASE } from "../../config";
import "./ExamResults.css";

export default function ExamResults() {
  const reg_no = 12345; // TEMP

  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [results, setResults] = useState([]);

  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");

  const [loaded, setLoaded] = useState(false);

  /* Load list data */
  const loadYears = async () => {
    const res = await axios.get(
      `${API_BASE}/api/students/years?reg_no=${reg_no}`
    );
    setYears(res.data || []);
  };

  const loadTerms = async (selectedYear) => {
    const res = await axios.get(
      `${API_BASE}/api/students/terms?reg_no=${reg_no}&year=${selectedYear}`
    );
    setTerms(res.data || []);
  };

  /* Load result */
  const loadResults = async () => {
    if (!year || !term) {
      alert("Please select year and term");
      return;
    }

    const res = await axios.get(`${API_BASE}/api/students/exam-results`, {
      params: { reg_no, year, term },
    });

    setResults(res.data || []);
    setLoaded(true);
  };

  return (
    <div className="marks-table-container">
      <header className="heading">
        <h1>Exam Results</h1>
      </header>

      {/* Filter area */}
      <Box className="bulk-actions">
        <FormControl size="small" sx={{ minWidth: 300 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            label="Year"
            onOpen={loadYears}
            onChange={(e) => {
              setYear(e.target.value);
              setTerm("");
              loadTerms(e.target.value);
            }}
          >
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ minWidth: 300 }}disabled={!year}>
          <InputLabel>Term</InputLabel>
          <Select
            value={term}
            label="Term"
            onChange={(e) => setTerm(e.target.value)}
          >
            {terms.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button onClick={loadResults} variant="contained">
          Load Results
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table className="results-table">
          <TableHead>
            <TableRow>
              <TableCell className="col-name">Subject</TableCell>
              <TableCell className="col-marks">Marks</TableCell>
              <TableCell className="col-grade">Grade</TableCell>
            </TableRow>
          </TableHead>

          <TableBody className="table-body">
            {results.length === 0 && (
              <TableRow style={{ height: 150 }}>
                <TableCell colSpan={3} align="center">
                  No results found
                </TableCell>
              </TableRow>
            )}

            {results.map((r, i) => (
              <TableRow key={i}>
                <TableCell>{r.subject}</TableCell>
                <TableCell>{r.marks}</TableCell>
                <TableCell>{r.grade}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}
