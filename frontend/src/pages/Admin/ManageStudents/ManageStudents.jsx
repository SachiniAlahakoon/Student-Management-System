import "./ManageStudents.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
} from "@mui/material";
import TablePagination from "@mui/material/TablePagination";

export default function ManageStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(0); // UI 0-based
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalRows, setTotalRows] = useState(0);

  // ================= FETCH =================
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/students`, {
        params: {
          page: page + 1, // backend is 1-based
          limit: rowsPerPage,
          search,
        },
      });

      setStudents(res.data.data);
      setTotalRows(res.data.total);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load students");
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [page, rowsPerPage, search]);

  // ================= UPDATE =================
  const handleChange = (e) => {
    setEditingStudent({
      ...editingStudent,
      [e.target.name]: e.target.value,
    });
  };

  const updateStudent = async () => {
  if (!editingStudent) return;

  try {
    await axios.put(
      `${API_BASE}/api/students/${editingStudent.reg_no}`,
      {
        initals: editingStudent.initals,
        student_firstname: editingStudent.student_firstname,
        student_lastname: editingStudent.student_lastname,
        address: editingStudent.address,
        birthday: editingStudent.birthday?.split("T")[0],
        admission_date: editingStudent.admission_date?.split("T")[0],
        blood_type: editingStudent.blood_type,
        Hcondition: editingStudent.Hcondition,
        contact1: editingStudent.contact1,
        contact2: editingStudent.contact2,
        class_id: editingStudent.class_id,
      }
    );

    toast.success("Student updated successfully");
    setEditingStudent(null);
    fetchStudents();
  } catch (err) {
    console.error(err);
    toast.error("Failed to update student");
  }
};


  // ================= DELETE =================
  const deleteStudent = async (reg_no) => {
    if (!window.confirm("Delete this student?")) return;

    try {
      await axios.delete(`${API_BASE}/api/students/${reg_no}`);
      toast.success("Student deleted successfully");
      fetchStudents();
    } catch {
      toast.error("Failed to delete student");
    }
  };

  return (
    <div className="content">
      <h2>Manage Students</h2>

      {/* TOP BAR */}
      <div className="subjects-top-bar">
        <input className="search"
          placeholder="Search student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <button onClick={() => navigate("/dashboard/admin/add-student")}>
          + Add Student
        </button>
      </div>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reg No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Age</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {students.length ? (
              students.map((s) => (
                <TableRow key={s.reg_no}>
                  <TableCell>{s.reg_no}</TableCell>
                  <TableCell>{s.full_name}</TableCell>
                  <TableCell>{s.class_name}</TableCell>
                  <TableCell>{s.address}</TableCell>
                  <TableCell>{s.age}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="View">
                      <IconButton
                        color="info"
                        onClick={() =>
                          navigate(
                            `/dashboard/admin/view-student/${s.reg_no}`
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => setEditingStudent(s)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => deleteStudent(s.reg_no)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
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

      {/* EDIT FORM */}
      {editingStudent && (
        <div className="edit-form-card">
          <h3>Edit Student</h3>

          <div className="form-row">
            <label>Initials</label>
            <input
              name="initals"
              value={editingStudent.initals}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>First Name</label>
            <input
              name="student_firstname"
              value={editingStudent.student_firstname}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Last Name</label>
            <input
              name="student_lastname"
              value={editingStudent.student_lastname}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Address</label>
            <input
              name="address"
              value={editingStudent.address}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Birthday</label>
            <input
              type="date"
              name="birthday"
              value={editingStudent.birthday?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </div>
          <div className="form-row">
  <label>Class ID</label>
  <input
    type="number"
    name="class_id"
    value={editingStudent.class_id || ""}
    onChange={handleChange}
    required
  />
</div>


          <div className="form-actions">
            <button className="btn-primary" onClick={updateStudent}>
              Update Student
            </button>
            <button
              className="btn-secondary"
              onClick={() => setEditingStudent(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
