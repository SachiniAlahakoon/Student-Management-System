import React, { useState } from "react";
import axios from "axios";
import dayjs from "dayjs";
import {
  Box,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TablePagination,
  Chip,
} from "@mui/material";
import "./AttendanceView.css";
import {API_BASE} from "../../config"

export default function AttendanceView() {
  const reg_no = 12345; // TEMP

  const [viewType, setViewType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendance, setAttendance] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  const fetchAttendance = async () => {
    if (!viewType) return;

    const params = {};
    if (viewType === "month") {
      if (!selectedYear || !selectedMonth)
        return alert("Select year and month");
      params.year = selectedYear;
      params.month = selectedMonth;
    } else if (viewType === "year") {
      if (!selectedYear) return alert("Select year");
      params.year = selectedYear;
    }

    try {
      const res = await axios.get(
        `${API_BASE}/api/attendance/${reg_no}/${viewType}`,
        { params }
      );
      setAttendance(res.data || []);
      setPage(0);
    } catch (err) {
      console.error("Attendance fetch error:", err);
      setAttendance([]);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div className="contentArea">
      <header className="heading">
        <h1>My Attendance</h1>
      </header>

      <Box sx={{ padding: 2 }}>
        <Box sx={{ display: "flex", gap: 2, mb: 2, flexWrap: "wrap" }}>
          <FormControl sx={{ minWidth: 120 }}>
            <InputLabel>View By</InputLabel>
            <Select
              sx={{ height: 40 }}
              value={viewType}
              label="View By"
              onChange={(e) => {
                setViewType(e.target.value);
                setAttendance([]);
                setSelectedYear("");
                setSelectedMonth("");
              }}
            >
              <MenuItem value="">Select View</MenuItem>
              <MenuItem value="week">Week</MenuItem>
              <MenuItem value="month">Month</MenuItem>
              <MenuItem value="year">Year</MenuItem>
            </Select>
          </FormControl>

          {(viewType === "month" || viewType === "year") && (
            <FormControl sx={{ minWidth: 100 }}>
              <InputLabel>Year</InputLabel>
              <Select
                sx={{ height: 40 }}
                value={selectedYear}
                label="Year"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                <MenuItem value="">Select Year</MenuItem>
                {Array.from({ length: 5 }, (_, i) => 2025 - i).map((y) => (
                  <MenuItem key={y} value={y}>
                    {y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {viewType === "month" && (
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Month</InputLabel>
              <Select
                sx={{ height: 40 }}
                value={selectedMonth}
                label="Month"
                onChange={(e) => setSelectedMonth(e.target.value)}
                disabled={!selectedYear}
              >
                <MenuItem value="">Select Month</MenuItem>
                {months.map((m) => (
                  <MenuItem key={m.value} value={m.value}>
                    {m.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button
            variant="contained"
            sx={{ height: 40 }}
            onClick={fetchAttendance}
          >
            Load Attendance
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={2} align="center">
                    No records
                  </TableCell>
                </TableRow>
              ) : (
                attendance
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((a, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        {dayjs(a.date).format("YYYY-MM-DD")}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={a.status}
                          color={a.status === "Present" ? "success" : "error"}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))
              )}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={attendance.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            rowsPerPageOptions={[5, 10, 20]}
          />
        </TableContainer>
      </Box>
    </div>
  );
}
