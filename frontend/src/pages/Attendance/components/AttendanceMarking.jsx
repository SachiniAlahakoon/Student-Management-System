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
  Select,
  MenuItem,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  Tooltip,
  Chip,
} from "@mui/material";
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import EventIcon from '@mui/icons-material/Event';
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Attendance.css";
import { TableVirtuoso } from "react-virtuoso";

/* =========================
   TABLE CONFIG - Updated to match MarksManagement style
========================= */
const columns = [
  { width: 60, label: "Select", dataKey: "select" },
  { width: 100, label: "Student ID", dataKey: "student_id" },
  { width: 250, label: "Student Name", dataKey: "name" },
  { width: 150, label: "Status", dataKey: "status" }
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

export default function AttendanceMarking({ selectedClass }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [markStatus, setMarkStatus] = useState("Present");
  const [selectAll, setSelectAll] = useState(false);
  const [isHoliday, setIsHoliday] = useState(false);

  useEffect(() => {
    if (!selectedClass) return;

    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      setSelectedRows([]);
      setSelectAll(false);
      setIsHoliday(false);

      try {
        const res = await axios.get(
          `http://localhost:5000/api/attendance/students/${selectedClass}`
        );

        const data = res.data || [];
        setStudents(data);
        setAttendance(data.map(() => "Present"));
      } catch (err) {
        setError("Failed to load students.");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [selectedClass]);

  const handleSelectAll = () => {
    if (isHoliday) return;
    if (selectAll) {
      setSelectedRows([]);
    } else {
      setSelectedRows(students.map((_, index) => index));
    }
    setSelectAll(!selectAll);
  };

  const handleSelectRow = (index) => {
    if (isHoliday) return;
    const newSelected = [...selectedRows];
    const rowIndex = newSelected.indexOf(index);
    
    if (rowIndex === -1) {
      newSelected.push(index);
    } else {
      newSelected.splice(rowIndex, 1);
    }
    
    setSelectedRows(newSelected);
    setSelectAll(newSelected.length === students.length);
  };

  const handleMarkAsHoliday = () => {
    if (students.length === 0) return;
    
    const updatedAttendance = students.map(() => "Holiday");
    setAttendance(updatedAttendance);
    setIsHoliday(true);
    setSelectedRows([]);
    setSelectAll(false);
    
    toast.success(`Marked as Holiday`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleMarkSelected = () => {
    if (isHoliday) {
      toast.warning("Cannot mark students when class is on holiday", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    if (selectedRows.length === 0) {
      toast.warning("Please select at least one student to mark", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedAttendance = [...attendance];
    selectedRows.forEach(index => {
      updatedAttendance[index] = markStatus;
    });
    
    setAttendance(updatedAttendance);
    
    toast.success(`Marked ${selectedRows.length} student(s) as ${markStatus}`, {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleStatusChange = (index, value) => {
    if (isHoliday) return;
    const updated = [...attendance];
    updated[index] = value;
    setAttendance(updated);
  };

  const handleReset = () => {
    setAttendance(students.map(() => "Present"));
    setSelectedRows([]);
    setSelectAll(false);
    setMarkStatus("Present");
    setIsHoliday(false);
    
    toast.info("All attendance reset to Present", {
      position: "top-right",
      autoClose: 3000,
    });
  };

  const handleSubmit = async () => {
    const payload = students.map((student, index) => ({
      student_id: student.student_id,
      status: attendance[index]
    }));

    try {
      await axios.post("http://localhost:5000/api/attendance/mark", {
        classId: selectedClass,
        date: new Date().toISOString().split("T")[0],
        attendance: payload
      });

      toast.success("Attendance submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
      });

      setSelectedRows([]);
      setSelectAll(false);
      setIsHoliday(false);
    } catch (err) {
      if (err.response?.status === 409) {
        toast.warning(err.response.data.message, {
          position: "top-right",
          autoClose: 4000,
        });
      } else {
        toast.error("❌ Error submitting attendance", {
          position: "top-right",
          autoClose: 4000,
        });
      }
    }
  };

  const fixedHeaderContent = () => (
    <TableRow>
      <TableCell padding="checkbox" align="center">
        <Checkbox
          icon={<CheckBoxOutlineBlankIcon />}
          checkedIcon={<CheckBoxIcon />}
          indeterminateIcon={<IndeterminateCheckBoxIcon />}
          indeterminate={selectedRows.length > 0 && selectedRows.length < students.length}
          checked={selectAll}
          onChange={handleSelectAll}
          disabled={students.length === 0 || isHoliday}
          sx={{ 
            padding: '4px',
            '&.Mui-disabled': {
              color: '#bdbdbd'
            }
          }}
        />
      </TableCell>
      {columns.slice(1).map((col) => (
        <TableCell
          key={col.dataKey}
          align="left"
          sx={{ 
            fontWeight: 600,
            backgroundColor: '#f5f5f5',
            color: '#333',
            borderBottom: '2px solid #e0e0e0'
          }}
        >
          {col.label}
        </TableCell>
      ))}
    </TableRow>
  );

  const rowContent = (index, student) => (
    <>
      <TableCell padding="checkbox" align="center">
        <Checkbox
          checked={selectedRows.includes(index)}
          onChange={() => handleSelectRow(index)}
          disabled={isHoliday}
          sx={{ 
            padding: '4px',
            '&.Mui-disabled': {
              color: '#bdbdbd'
            }
          }}
        />
      </TableCell>
      <TableCell align="left">{student.student_id}</TableCell>
      <TableCell align="left">
        {student.student_firstname} {student.student_lastname}
      </TableCell>
      <TableCell align="left">
        {isHoliday ? (
          <Chip
            label="HOLIDAY"
            size="small"
            color="secondary"
            sx={{ 
              fontWeight: 'bold',
              minWidth: 100,
              backgroundColor: '#9c27b0',
              color: 'white'
            }}
          />
        ) : (
          <Select
            value={attendance[index] || "Present"}
            size="small"
            onChange={(e) => handleStatusChange(index, e.target.value)}
            sx={{ 
              minWidth: 120,
              height: '32px',
              fontSize: '0.875rem'
            }}
          >
            <MenuItem value="Present">Present</MenuItem>
            <MenuItem value="Absent">Absent</MenuItem>
            <MenuItem value="Late">Late</MenuItem>
          </Select>
        )}
      </TableCell>
    </>
  );

  return (
    <Box sx={{ width: "100%" }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        mb: 3 
      }}>
        <Typography
          variant="h6"
          sx={{
            color: '#1976d2',
            fontWeight: 600,
            fontSize: '1.25rem'
          }}
        >
          Mark Attendance - Grade {selectedClass}
        </Typography>
        
        {isHoliday && (
          <Chip
            label="CLASS ON HOLIDAY"
            color="secondary"
            icon={<EventIcon />}
            sx={{ 
              fontWeight: 'bold',
              backgroundColor: '#9c27b0',
              color: 'white'
            }}
          />
        )}
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

      {isHoliday && (
        <Alert 
          severity="info" 
          sx={{ 
            mb: 3,
            borderRadius: '4px'
          }}
          icon={<EventIcon />}
          action={
            <Button 
              color="inherit" 
              size="small" 
              onClick={handleReset}
              sx={{ textTransform: 'none' }}
            >
              Undo Holiday
            </Button>
          }
        >
          Class is marked as holiday for today. No attendance submission required.
        </Alert>
      )}

      {/* CONTROLS SECTION */}
      <Box sx={{ 
        mb: 3,
        p: 2,
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e0e0e0'
      }}>
        <Box sx={{ 
          display: 'flex', 
          gap: 2, 
          alignItems: 'center',
          flexWrap: 'wrap'
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: '#666',
              minWidth: '120px'
            }}
          >
            Selected: <strong>{selectedRows.length}</strong> students
          </Typography>

          <FormControl 
            size="small" 
            sx={{ 
              minWidth: 120,
              '& .MuiOutlinedInput-root': {
                height: '36px'
              }
            }}
            disabled={isHoliday}
          >
            <InputLabel>Mark as</InputLabel>
            <Select
              value={markStatus}
              label="Mark as"
              onChange={(e) => setMarkStatus(e.target.value)}
            >
              <MenuItem value="Present">Present</MenuItem>
              <MenuItem value="Absent">Absent</MenuItem>
              <MenuItem value="Late">Late</MenuItem>
            </Select>
          </FormControl>

          <Button
            variant="contained"
            size="small"
            onClick={handleMarkSelected}
            disabled={selectedRows.length === 0 || isHoliday}
            sx={{ 
              minWidth: 120,
              height: '36px',
              textTransform: 'none'
            }}
          >
            Mark Selected
          </Button>

          <Box sx={{ flex: 1 }} />

          <Tooltip title="Mark entire class as holiday for today">
            <Button
              variant="contained"
              color="secondary"
              startIcon={<EventIcon />}
              onClick={handleMarkAsHoliday}
              disabled={students.length === 0 || isHoliday}
              sx={{ 
                minWidth: 140,
                height: '36px',
                textTransform: 'none',
                backgroundColor: '#9c27b0',
                '&:hover': {
                  backgroundColor: '#7b1fa2'
                }
              }}
            >
              Mark as Holiday
            </Button>
          </Tooltip>

          <Button
            variant="outlined"
            color="error"
            onClick={handleReset}
            disabled={isHoliday}
            sx={{ 
              height: '36px',
              textTransform: 'none'
            }}
          >
            Reset All
          </Button>
        </Box>
      </Box>

      {/* TABLE */}
      <Paper 
        elevation={1}
        sx={{ 
          borderRadius: '8px',
          overflow: 'hidden',
          mb: 3
        }}
      >
        {loading ? (
          <Box sx={{ 
            p: 5, 
            textAlign: 'center',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <CircularProgress />
          </Box>
        ) : students.length === 0 ? (
          <Box sx={{ p: 5, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No students available
            </Typography>
          </Box>
        ) : (
          <TableVirtuoso
            data={students}
            components={TableComponents}
            fixedHeaderContent={fixedHeaderContent}
            itemContent={rowContent}
            style={{ height: 400 }}
          />
        )}
      </Paper>

      {/* SUBMIT SECTION */}
      <Box sx={{ 
        p: 2,
        backgroundColor: isHoliday ? '#e8f5e9' : '#f8f9fa',
        borderRadius: '8px',
        border: isHoliday ? '2px solid #4caf50' : '1px solid #e0e0e0'
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Box>
            <Typography 
              variant="body2" 
              sx={{ 
                color: isHoliday ? '#2e7d32' : '#666',
                fontWeight: isHoliday ? 600 : 400,
                mb: 1
              }}
            >
              {isHoliday ? (
                <>🎉 Class is on holiday - No attendance submission required</>
              ) : (
                <>Ready to submit attendance for <strong>{students.length}</strong> student(s)</>
              )}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#666',
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap'
              }}
            >
              <span style={{ color: '#2e7d32' }}>Present: {attendance.filter(a => a === "Present").length}</span>
              <span style={{ color: '#d32f2f' }}>Absent: {attendance.filter(a => a === "Absent").length}</span>
              <span style={{ color: '#ed6c02' }}>Late: {attendance.filter(a => a === "Late").length}</span>
              
            </Typography>
          </Box>
          
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isHoliday}
            sx={{ 
              minWidth: 160,
              height: '40px',
              textTransform: 'none',
              fontWeight: 600,
              backgroundColor: isHoliday ? '#9e9e9e' : '#1976d2',
              '&:hover': {
                backgroundColor: isHoliday ? '#9e9e9e' : '#1565c0'
              },
              '&.Mui-disabled': {
                backgroundColor: '#e0e0e0',
                color: '#9e9e9e'
              }
            }}
          >
            {isHoliday ? "Holiday - No Submit" : "Submit Attendance"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}