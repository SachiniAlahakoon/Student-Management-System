import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ManageTeachers.css";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  Button,
  TextField,
} from "@mui/material";

export default function ManageTeachers() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [total, setTotal] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // UI is 0-based
  const rowsPerPage = 5;

  const [editingTeacher, setEditingTeacher] = useState(null);

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/teachers`, {
        params: {
          page: page + 1, // backend is 1-based
          limit: rowsPerPage,
          search,
        },
      });

      setTeachers(res.data.data);
      setTotal(res.data.total);
    } catch {
      toast.error("Failed to load teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [page, search]);

  // Delete teacher
  const deleteTeacher = async (teacher_id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(`${API_BASE}/api/teachers/${teacher_id}`);
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  // Edit teacher
  const handleChange = (e) => {
    setEditingTeacher({
      ...editingTeacher,
      [e.target.name]: e.target.value,
    });
  };

  const updateTeacher = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/teachers/${editingTeacher.teacher_id}`,
        {
          id_no: editingTeacher.id_no,
          teacher_name: editingTeacher.teacher_name,
          birthday: editingTeacher.birthday,
          phone: editingTeacher.phone,
          email: editingTeacher.email,
        }
      );

      toast.success("Teacher updated successfully");
      setEditingTeacher(null);
      fetchTeachers();
    } catch {
      toast.error("Failed to update teacher");
    }
  };

  return (
    <div className="content">
      <h2>Manage Teachers</h2>

      {/* Top bar */}
      <div className="teachers-top-bar">
        <TextField
          size="small"
          placeholder="Search..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/admin/add-teacher")}
        >
          + Add Teacher
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID No</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Birthday</TableCell>
              <TableCell>Age</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {teachers.length ? (
              teachers.map((t) => (
                <TableRow key={t.teacher_id}>
                  <TableCell>{t.id_no}</TableCell>
                  <TableCell>{t.teacher_name}</TableCell>
                  <TableCell>{t.birthday?.split("T")[0]}</TableCell>
                  <TableCell>{t.age}</TableCell>
                  <TableCell>{t.phone}</TableCell>
                  <TableCell>{t.email}</TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() => setEditingTeacher(t)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => deleteTeacher(t.teacher_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No teachers found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={total}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[rowsPerPage]}
        />
      </TableContainer>

      {/* Editing form */}
      {editingTeacher && (
        <div className="edit-form-card">
          <h3>Edit Teacher</h3>

          <div className="form-row">
            <label>ID No</label>
            <input
              name="id_no"
              value={editingTeacher.id_no}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Name</label>
            <input
              name="teacher_name"
              value={editingTeacher.teacher_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Birthday</label>
            <input
              type="date"
              name="birthday"
              value={editingTeacher.birthday?.split("T")[0] || ""}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              name="phone"
              value={editingTeacher.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Email</label>
            <input
              name="email"
              value={editingTeacher.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={updateTeacher}>
              Update Teacher
            </button>
            <button
              className="btn-secondary"
              onClick={() => setEditingTeacher(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
