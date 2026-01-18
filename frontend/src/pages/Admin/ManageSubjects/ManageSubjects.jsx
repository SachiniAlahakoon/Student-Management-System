import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
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

import "./ManageSubjects.css";

export default function ManageSubjects() {
  const navigate = useNavigate();

  const [subjects, setSubjects] = useState([]);
  const [totalSubjects, setTotalSubjects] = useState(0);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0); // UI 0-based
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [editingSubject, setEditingSubject] = useState(null);

  // ================= FETCH SUBJECTS =================
  const fetchSubjects = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/subjects`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
        },
      });

      setSubjects(res.data.data);
      setTotalSubjects(res.data.total);
    } catch {
      toast.error("Failed to load subjects");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [page, rowsPerPage, search]);

  // ================= DELETE =================
  const deleteSubject = async (subject_id) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await axios.delete(`${API_BASE}/api/subjects/${subject_id}`);
      toast.success("Subject deleted successfully 🗑️");
      fetchSubjects();
    } catch {
      toast.error("Failed to delete subject");
    }
  };

  // ================= EDIT =================
  const handleChange = (e) => {
    setEditingSubject((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const updateSubject = async () => {
    try {
      const teacherNamesArray = editingSubject.teacher_names
        ? editingSubject.teacher_names
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : [];

      await axios.put(
        `${API_BASE}/api/subjects/${editingSubject.subject_id}/teacher`,
        {
          subject_name: editingSubject.subject_name,
          teacher_names: teacherNamesArray,
          class_id: editingSubject.class_id || 1, // adjust if needed
        }
      );

      toast.success("Subject updated successfully ✅");
      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update subject");
    }
  };

  return (
    <div className="content">
      <h2>Manage Subjects</h2>

      {/* TOP BAR */}
      <div className="subjects-top-bar">
        <TextField
          size="small"
          placeholder="Search subject..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />
        <Button
          variant="contained"
          onClick={() => navigate("/dashboard/admin/add-subject")}
        >
          + Add Subject
        </Button>
      </div>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Subject Name</TableCell>
              <TableCell>Teacher(s)</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {subjects.length ? (
              subjects.map((s) => (
                <TableRow key={s.subject_id}>
                  <TableCell>{s.subject_id}</TableCell>
                  <TableCell>{s.subject_name}</TableCell>
                  <TableCell>
                    {s.teacher_names || "Not assigned"}
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          setEditingSubject({
                            ...s,
                            teacher_names: s.teacher_names || "",
                          })
                        }
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>

                    <Tooltip title="Delete">
                      <IconButton
                        color="error"
                        onClick={() => deleteSubject(s.subject_id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No records found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        <TablePagination
          component="div"
          count={totalSubjects}
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
      {editingSubject && (
        <div className="edit-form-card">
          <h3>Edit Subject</h3>

          <div className="form-row">
            <label>Subject Name</label>
            <input
              name="subject_name"
              value={editingSubject.subject_name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Teachers</label>
            <input
              name="teacher_names"
              placeholder="e.g. Devindya, Chathuranga"
              value={editingSubject.teacher_names}
              onChange={handleChange}
            />
          </div>

          <div className="form-actions">
            <button className="btn-primary" onClick={updateSubject}>
              Update Subject
            </button>
            <button
              className="btn-secondary"
              onClick={() => setEditingSubject(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
