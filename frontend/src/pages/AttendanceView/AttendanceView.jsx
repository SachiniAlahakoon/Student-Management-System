import React, { useState, useEffect } from "react";
import axios from "axios";
import dayjs from "dayjs";
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
import { API_BASE } from "../../config";
import "./AttendanceView.css";

export default function AttendanceView() {
  const reg_no = 12345; // TEMP

  const [viewType, setViewType] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedWeek, setSelectedWeek] = useState("");
  const [attendance, setAttendance] = useState([]);
  const [weeks, setWeeks] = useState([]);
  const [loaded, setLoaded] = useState(false);

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


  useEffect(() => {
    if (!selectedYear || !selectedMonth) return;

    const start = dayjs(`${selectedYear}-${selectedMonth}-01`);
    const end = start.endOf("month");
    const weeksArray = [];
    let weekStart = start.startOf("week");
    let weekNum = 1;

    while (weekStart.isBefore(end)) {
      const weekEnd = weekStart.add(6, "day").isAfter(end)
        ? end
        : weekStart.add(6, "day");
      weeksArray.push({
        value: weekNum,
        label: `Week ${weekNum} (${weekStart.format(
          "DD MMM"
        )} - ${weekEnd.format("DD MMM")})`,
      });
      weekStart = weekStart.add(7, "day");
      weekNum++;
    }

    setWeeks(weeksArray);
    setSelectedWeek("");
  }, [selectedYear, selectedMonth]);

  const fetchAttendance = async () => {
    if (!viewType) return;

    const params = {};
    let resData = [];

    if (viewType === "month") {
      if (!selectedYear || !selectedMonth)
        return alert("Select year and month");
      params.year = selectedYear;
      params.month = selectedMonth;

      try {
        const res = await axios.get(
          `${API_BASE}/api/attendance/${reg_no}/month`,
          { params }
        );
        resData = res.data || [];
      } catch (err) {
        console.error("Attendance fetch error:", err);
        resData = [];
      }
    } else if (viewType === "year") {
      if (!selectedYear) return alert("Select year");
      params.year = selectedYear;

      try {
        const res = await axios.get(
          `${API_BASE}/api/attendance/${reg_no}/year`,
          { params }
        );
        resData = res.data || [];
      } catch (err) {
        console.error("Attendance fetch error:", err);
        resData = [];
      }
    } else if (viewType === "week") {
      if (!selectedYear || !selectedMonth || !selectedWeek)
        return alert("Select year, month, and week");

      params.year = selectedYear;
      params.month = selectedMonth;

      try {
        const res = await axios.get(
          `${API_BASE}/api/attendance/${reg_no}/month`,
          { params }
        );
        const allMonthData = res.data || [];

        const weekIndex = Number(selectedWeek) - 1;
        const startDate = dayjs(`${selectedYear}-${selectedMonth}-01`)
          .startOf("week")
          .add(weekIndex * 7, "day");
        const endDate = startDate.add(6, "day");

        resData = allMonthData.filter((a) => {
          const date = dayjs(a.date);
          return (
            date.isSame(startDate) ||
            date.isSame(endDate) ||
            (date.isAfter(startDate) && date.isBefore(endDate))
          );
        });
      } catch (err) {
        console.error("Attendance fetch error:", err);
        resData = [];
      }
    }

    setAttendance(resData);
    setLoaded(true);
  };

  return (
    <div className="marks-table-container">
      <header className="heading">
        <h1>My Attendance</h1>
      </header>

      <Box className="bulk-actions">
        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>View By</InputLabel>
          <Select
            value={viewType}
            label="View By"
            onChange={(e) => {
              setViewType(e.target.value);
              setAttendance([]);
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

        {(viewType === "month" ||
          viewType === "year" ||
          viewType === "week") && (
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Year</InputLabel>
            <Select
              value={selectedYear}
              label="Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {Array.from({ length: 5 }, (_, i) => 2025 - i).map((y) => (
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
          onClick={fetchAttendance}
          variant="contained"
          sx={{ height: 40, minWidth: 180 }}
        >
          Load Attendance
        </Button>
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table className="results-table">
          <TableHead>
            <TableRow>
              <TableCell className="col-name">Date</TableCell>
              <TableCell className="col-marks">Status</TableCell>
            </TableRow>
          </TableHead>

          <TableBody className="table-body">
            {(attendance.length === 0 || !loaded) && (
              <TableRow style={{ height: 150 }}>
                <TableCell colSpan={2} align="center">
                  No records
                </TableCell>
              </TableRow>
            )}

            {attendance.map((a, i) => (
              <TableRow key={i}>
                <TableCell>{dayjs(a.date).format("YYYY-MM-DD")}</TableCell>
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
      </TableContainer>
    </div>
  );
}
