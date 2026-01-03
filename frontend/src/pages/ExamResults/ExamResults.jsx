import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
} from "@mui/material";
import {API_BASE} from "../../config";


export default function ExamResults() {
  const reg_no = 12345; // TEMP

  const [years, setYears] = useState([]);
  const [terms, setTerms] = useState([]);
  const [results, setResults] = useState([]);

  const [year, setYear] = useState("");
  const [term, setTerm] = useState("");

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

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

    const res = await axios.get(
      `${API_BASE}/api/students/exam-results`,
      {
        params: { reg_no, year, term },
      }
    );

    setResults(res.data || []);
    setPage(1);
    setLoaded(true);
  };

  /* Pagination part */
  const paginatedResults = results.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  /* User Interface */
  return (
    <div className="contentArea">
      <header className="heading">
        <h1>Exam Results</h1>
      </header>

      <Box p={3}>

        {/* Filter area */}
        <Box display="flex" gap={2} mb={3}>
          <FormControl fullWidth>
            <InputLabel>Year</InputLabel>
            <Select
              sx={{ height: 40, maxWidth: 500 }}
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

          <FormControl fullWidth disabled={!year}>
            <InputLabel>Term</InputLabel>
            <Select
              sx={{ height: 40, maxWidth: 500 }}
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

          <Button
            variant="contained"
            sx={{ height: 40, width: 400 }}
            color="primary"
            onClick={loadResults}
          >
            Load Results
          </Button>
        </Box>

        {/* Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Marks</TableCell>
                <TableCell>Grade</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loaded && paginatedResults.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    No results found
                  </TableCell>
                </TableRow>
              )}

              {paginatedResults.map((r, i) => (
                <TableRow key={i}>
                  <TableCell>{r.subject}</TableCell>
                  <TableCell>{r.marks}</TableCell>
                  <TableCell>{r.grade}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        {results.length > rowsPerPage && (
          <Box mt={2} display="flex" justifyContent="center">
            <Pagination
              count={Math.ceil(results.length / rowsPerPage)}
              page={page}
              onChange={(e, value) => setPage(value)}
            />
          </Box>
        )}
      </Box>
    </div>
  );
}
