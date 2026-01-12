import * as React from "react";
import { useEffect, useState } from "react";
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
} from "@mui/material";
import axios from "axios";
import "../Attendance.css";
import { TableVirtuoso } from "react-virtuoso";

/* =========================
   TABLE CONFIG - Updated to match MarksManagement style
========================= */
const columns = [
  { width: 100, label: "Student ID", dataKey: "student_id" },
  { width: 120, label: "Reg No", dataKey: "reg_no" },
  { width: 100, label: "Initials", dataKey: "initals" },
  { width: 200, label: "First Name", dataKey: "student_firstname" },
  { width: 200, label: "Last Name", dataKey: "student_lastname" },
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

export default function StudentList({ selectedClass }) {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset state when class changes
    setStudents([]);
    setError(null);

    if (!selectedClass) return;

    const fetchStudents = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/attendance/students/${selectedClass}`);
        
        if (res.data && Array.isArray(res.data)) {
          setStudents(res.data);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("API Error:", err);
        const errorMessage = err.response?.data?.error || "Failed to load students. Ensure the class name matches the database.";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

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
    <React.Fragment>
      {columns.map((column) => (
        <TableCell 
          key={column.dataKey} 
          align="left"
          sx={{ 
            padding: '12px 16px',
            borderBottom: '1px solid #e0e0e0'
          }}
        >
          {row[column.dataKey] || '—'}
        </TableCell>
      ))}
    </React.Fragment>
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Typography 
        variant="h6" 
        sx={{ 
          mb: 3, 
          color: '#1976d2',
          fontWeight: 600,
          fontSize: '1.25rem'
        }}
      >
        Student List - Grade {selectedClass}
      </Typography>

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

      <Paper 
        elevation={1}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          minHeight: 200
        }}
      >
        {loading ? (
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center',
            p: 5 
          }}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 && !error ? (
          <Box sx={{ 
            p: 5, 
            textAlign: 'center',
            color: 'text.secondary'
          }}>
            <Typography>
              {selectedClass ? "No students found in this class." : "Please select a grade from the dropdown."}
            </Typography>
          </Box>
        ) : (
          <TableVirtuoso
            style={{ height: 400 }}
            data={students}
            components={TableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
          />
        )}
      </Paper>
    </Box>
  );
}