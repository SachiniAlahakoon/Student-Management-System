import * as React from "react";
import { useEffect, useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Button,
} from "@mui/material";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../Attendance.css";
import { TableVirtuoso } from "react-virtuoso";

/* =========================
   TABLE CONFIG - Updated to match MarksManagement style
========================= */
const columns = [
  { width: 200, label: "Date", dataKey: "date" },
  { width: 120, label: "Present", dataKey: "Present" },
  { width: 120, label: "Absent", dataKey: "Absent" },
  { width: 120, label: "Late", dataKey: "Late" },
  { width: 120, label: "Holiday", dataKey: "Holiday" }
];

// Custom table components for consistent styling
const TableComponents = {
  Scroller: React.forwardRef((props, ref) => (
    <TableContainer 
      component={Paper} 
      {...props} 
      ref={ref} 
      elevation={1}
      sx={{ 
        borderRadius: '8px',
        overflow: 'hidden'
      }}
    />
  )),
  Table: (props) => (
    <Table 
      {...props} 
      stickyHeader
      sx={{
        minWidth: 650,
        '& .MuiTableCell-head': {
          backgroundColor: '#f5f5f5',
          fontWeight: 600,
          color: '#333',
          padding: '12px 16px',
          borderBottom: '2px solid #e0e0e0'
        },
        '& .MuiTableCell-body': {
          padding: '12px 16px',
          borderBottom: '1px solid #e0e0e0'
        }
      }}
    />
  ),
  TableHead: React.forwardRef((props, ref) => <TableHead {...props} ref={ref} />),
  TableRow: (props) => <TableRow {...props} hover sx={{ '&:last-child td': { borderBottom: 0 } }} />,
  TableBody: React.forwardRef((props, ref) => <TableBody {...props} ref={ref} />),
};

export default function AttendanceReport({ selectedClass }) {
  const [period, setPeriod] = useState("daily");
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const formatDateBasedOnPeriod = (dateString, p) => {
    const date = new Date(dateString);
    switch (p) {
      case "daily":
        return date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric"
        });
      case "weekly":
        const end = new Date(date);
        end.setDate(date.getDate() + 6);
        return `${date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric"
        })} - ${end.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric"
        })}`;
      case "monthly":
        return date.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric"
        });
      case "yearly":
        return date.getFullYear();
      default:
        return dateString;
    }
  };

  useEffect(() => {
    if (!selectedClass) return;

    const fetchReport = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/report/${selectedClass}?period=${period}`
        );

        const data = res.data.map((item) => ({
          date: item.date,
          status: item.status,
          count: Number(item.count)
        }));

        setAttendanceData(data);
      } catch {
        setError("Failed to load attendance report.");
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, [selectedClass, period]);

  const groupedData = useMemo(() => {
    const map = {};

    attendanceData.forEach((item) => {
      if (!map[item.date]) {
        map[item.date] = {
          date: formatDateBasedOnPeriod(item.date, period),
          Present: 0,
          Absent: 0,
          Late: 0,
          Holiday: 0,
          rawDate: item.date
        };
      }
      map[item.date][item.status] += item.count;
    });

    return Object.values(map).sort(
      (a, b) => new Date(b.rawDate) - new Date(a.rawDate)
    );
  }, [attendanceData, period]);

  const summary = groupedData.reduce(
    (acc, row) => {
      acc.Present += row.Present;
      acc.Absent += row.Absent;
      acc.Late += row.Late;
      acc.Holiday += row.Holiday;
      acc.total += row.Present + row.Absent + row.Late + row.Holiday;
      return acc;
    },
    { Present: 0, Absent: 0, Late: 0, Holiday: 0, total: 0 }
  );

  const attendanceRate =
    summary.total === 0
      ? "0.0"
      : (((summary.Present + summary.Late) / summary.total) * 100).toFixed(1);

  const handleExportPDF = () => {
    if (!groupedData.length) {
      alert("No data to export");
      return;
    }

    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Attendance Report", 14, 15);
    doc.setFontSize(11);
    doc.text(`Class: Grade ${selectedClass}`, 14, 24);
    doc.text(`Period: ${period}`, 14, 30);

    autoTable(doc, {
      startY: 38,
      head: [["Date", "Present", "Absent", "Late", "Holiday"]],
      body: groupedData.map((r) => [
        r.date,
        r.Present,
        r.Absent,
        r.Late,
        r.Holiday
      ]),
      headStyles: { fillColor: [25, 118, 210] }
    });

    const y = doc.lastAutoTable.finalY + 10;
    doc.text(`Present: ${summary.Present}`, 14, y);
    doc.text(`Absent: ${summary.Absent}`, 14, y + 6);
    doc.text(`Late: ${summary.Late}`, 14, y + 12);
    doc.text(`Holiday: ${summary.Holiday}`, 14, y + 18);
    doc.text(`Attendance Rate: ${attendanceRate}%`, 14, y + 24);

    doc.save(
      `attendance_report_grade_${selectedClass}_${period}_${new Date()
        .toISOString()
        .split("T")[0]}.pdf`
    );
  };

  const fixedHeaderContent = () => (
    <TableRow>
      {columns.map((column) => (
        <TableCell
          key={column.dataKey}
          align="left"
          sx={{ 
            fontWeight: 600,
            backgroundColor: '#f5f5f5',
            color: '#333',
            borderBottom: '2px solid #e0e0e0'
          }}
        >
          {column.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (_index, row) => (
    <>
      <TableCell align="left">{row.date}</TableCell>
      <TableCell 
        align="center" 
        sx={{ 
          color: '#2e7d32',
          fontWeight: 500
        }}
      >
        {row.Present}
      </TableCell>
      <TableCell 
        align="center"
        sx={{ 
          color: '#d32f2f',
          fontWeight: 500
        }}
      >
        {row.Absent}
      </TableCell>
      <TableCell 
        align="center"
        sx={{ 
          color: '#ed6c02',
          fontWeight: 500
        }}
      >
        {row.Late}
      </TableCell>
      <TableCell 
        align="center"
        sx={{ 
          color: '#9c27b0',
          fontWeight: 500
        }}
      >
        {row.Holiday}
      </TableCell>
    </>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: '#1976d2',
          fontWeight: 600,
          fontSize: '1.25rem'
        }}
      >
        Attendance Report - Grade {selectedClass}
      </Typography>

      {!selectedClass ? (
        <Alert 
          severity="info"
          sx={{ 
            borderRadius: '4px'
          }}
        >
          Select a class to view report.
        </Alert>
      ) : (
        <>
          {/* CONTROLS SECTION */}
          <Box sx={{ 
            mb: 3,
            p: 2,
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '1px solid #e0e0e0'
          }}>
            <Box sx={{ 
              display: "flex", 
              gap: 1, 
              alignItems: 'center',
              flexWrap: 'wrap'
            }}>
              {["daily", "weekly", "monthly", "yearly"].map((p) => (
                <Button
                  key={p}
                  variant={period === p ? "contained" : "outlined"}
                  size="small"
                  onClick={() => setPeriod(p)}
                  sx={{ 
                    textTransform: 'none',
                    minWidth: 80
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </Button>
              ))}
              
              <Box sx={{ flex: 1 }} />
              
              <Button
                variant="contained"
                disabled={!groupedData.length}
                onClick={handleExportPDF}
                sx={{ 
                  minWidth: 120,
                  height: '36px',
                  textTransform: 'none'
                }}
              >
                Export PDF
              </Button>
            </Box>
          </Box>

          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: '4px'
              }}
            >
              {error}
            </Alert>
          )}

          {/* SUMMARY CARDS */}
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 2, 
            mb: 3
          }}>
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid #2e7d32',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Present
              </Typography>
              <Typography variant="h5" color="#2e7d32" fontWeight="bold">
                {summary.Present}
              </Typography>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid #d32f2f',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Absent
              </Typography>
              <Typography variant="h5" color="#d32f2f" fontWeight="bold">
                {summary.Absent}
              </Typography>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid #ed6c02',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Late
              </Typography>
              <Typography variant="h5" color="#ed6c02" fontWeight="bold">
                {summary.Late}
              </Typography>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid #9c27b0',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Holiday
              </Typography>
              <Typography variant="h5" color="#9c27b0" fontWeight="bold">
                {summary.Holiday}
              </Typography>
            </Paper>
            
            <Paper 
              sx={{ 
                p: 2, 
                borderRadius: '8px',
                borderLeft: '4px solid #1976d2',
                backgroundColor: '#f8f9fa'
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Attendance Rate
              </Typography>
              <Typography variant="h5" color="#1976d2" fontWeight="bold">
                {attendanceRate}%
              </Typography>
            </Paper>
          </Box>

          {/* TABLE */}
          <Paper 
            elevation={1}
            sx={{ 
              borderRadius: '8px',
              overflow: 'hidden'
            }}
          >
            {loading ? (
              <Box sx={{ 
                p: 4, 
                textAlign: "center",
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <CircularProgress />
              </Box>
            ) : groupedData.length === 0 ? (
              <Box sx={{ p: 5, textAlign: "center" }}>
                <Typography color="text.secondary">
                  No attendance data found for Grade {selectedClass}.
                </Typography>
              </Box>
            ) : (
              <TableVirtuoso
                data={groupedData}
                components={TableComponents}
                fixedHeaderContent={fixedHeaderContent}
                itemContent={rowContent}
                style={{ height: 400 }}
              />
            )}
          </Paper>

          {/* FOOTER INFO */}
          {groupedData.length > 0 && !loading && (
            <Box sx={{ 
              mt: 2, 
              p: 1.5, 
              backgroundColor: '#f8f9fa',
              borderRadius: '8px',
              border: '1px solid #e0e0e0'
            }}>
              <Typography variant="body2" color="text.secondary">
                Showing {groupedData.length} {period === 'daily' ? 'days' : 
                period === 'weekly' ? 'weeks' : 
                period === 'monthly' ? 'months' : 'years'} of attendance data
              </Typography>
            </Box>
          )}
        </>
      )}
    </Box>
  );
}