import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import "moment/locale/en-gb";

import {
  Box,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  Chip,
} from "@mui/material";

import TablePagination from "@mui/material/TablePagination";

import { API_BASE } from "../../config";
import EmptyStateCard from "../../components/EmptyStateCard/EmptyStateCard";
import "./AttendanceView.css";

export default function AttendanceView() {
  const [viewType, setViewType] = useState("");
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

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

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const res = await axios.get(
          `${API_BASE}/api/students/attendance/years`,
          { headers: getAuthHeader() }
        );
        setAvailableYears(res.data || []);
      } catch {
        setAvailableYears([]);
      }
    };

    fetchYears();
  }, []);

  /* Month → Week calculation (moment version) */
  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;

    const start = moment(`${selectedYear}-${selectedMonth}-01`);
    const end = start.clone().endOf("month");

    let current = start.clone().startOf("isoWeek");
    let index = 1;
    const list = [];

    while (current.isBefore(end) || current.isSame(end, "day")) {
      const weekStart = current.clone();
      const weekEnd = current.clone().add(6, "days").isAfter(end)
        ? end.clone()
        : current.clone().add(6, "days");

      list.push({
        value: index,
        label: `Week ${index} (${weekStart.format(
          "DD MMM"
        )} - ${weekEnd.format("DD MMM")})`,
      });

      current.add(7, "days");
      index++;
    }

    setWeeks(list);
    setSelectedWeek("");
  }, [selectedYear, selectedMonth]);

  useEffect(() => {
    setAttendance([]);
    setLoaded(false);
    setPage(0);
  }, [viewType, selectedYear, selectedMonth, selectedWeek]);

  const fetchAttendance = async () => {
    if (!viewType) return;

    try {
      const res = await axios.get(
        `${API_BASE}/api/students/attendance/${viewType}`,
        {
          headers: getAuthHeader(),
          params: {
            year: selectedYear,
            month: selectedMonth,
            week: selectedWeek,
            page,
            limit: rowsPerPage,
          },
        }
      );

      setAttendance(res.data.data || []);
      setTotalRows(res.data.total || 0);
      setLoaded(true);
    } catch (err) {
      console.error("Attendance fetch error", err);
      setAttendance([]);
      setLoaded(true);
    }
  };

  useEffect(() => {
    if (!loaded) return;
    fetchAttendance();
  }, [page, rowsPerPage]);

  const isLoadDisabled =
    !viewType ||
    (viewType === "year" && !selectedYear) ||
    (viewType === "month" && (!selectedYear || !selectedMonth)) ||
    (viewType === "week" && (!selectedYear || !selectedMonth || !selectedWeek));

  return (
    <div className="contentArea">
      <header className="mainHeading">
        <h1 className="mainHeading-att">My Attendance</h1>
      </header>

      <Box className="bulk-actions">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>View By</InputLabel>
          <Select
            value={viewType}
            label="View By"
            onChange={(e) => {
              setViewType(e.target.value);
              setSelectedYear("");
              setSelectedMonth("");
              setSelectedWeek("");
            }}
          >
            <MenuItem value="week">Week</MenuItem>
            <MenuItem value="month">Month</MenuItem>
            <MenuItem value="year">Year</MenuItem>
          </Select>
        </FormControl>

        {viewType && (
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {availableYears.map((y) => (
                <MenuItem key={y} value={y}>
                  {y}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {(viewType === "month" || viewType === "week") && (
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={selectedMonth}
              label="Month"
              onChange={(e) => setSelectedMonth(e.target.value)}
              disabled={!selectedYear}
            >
              {months.map((m) => (
                <MenuItem key={m.value} value={m.value}>
                  {m.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        {viewType === "week" && (
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Week</InputLabel>
            <Select
              value={selectedWeek}
              label="Week"
              onChange={(e) => setSelectedWeek(e.target.value)}
              disabled={!selectedMonth}
            >
              {weeks.map((w) => (
                <MenuItem key={w.value} value={w.value}>
                  {w.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Button
          onClick={() => {
            setPage(0);
            fetchAttendance();
          }}
          variant="contained"
          disabled={isLoadDisabled}
          sx={{ height: 40, minWidth: 180 }}
        >
          Load Attendance
        </Button>
      </Box>

      {!loaded ? (
        <EmptyStateCard message="Select filters to load attendance records" />
      ) : attendance.length === 0 ? (
        <EmptyStateCard message="No attendance records found" />
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {attendance.map((a, i) => (
                <TableRow key={i}>
                  <TableCell>
                    {moment(a.date).format("YYYY-MM-DD")}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={a.status}
                      color={a.status === "Present" ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <TablePagination
            component="div"
            count={totalRows}
            page={page}
            onPageChange={(e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[5, 10, 25]}
          />
        </TableContainer>
      )}
    </div>
  );
}
