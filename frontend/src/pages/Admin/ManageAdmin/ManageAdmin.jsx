import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  Paper,
  IconButton,
  Tooltip,
  TablePagination,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import "./ManageAdmin.css";

export default function ManageAdmin() {
  const navigate = useNavigate();

  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  // edit form
  const [editingId, setEditingId] = useState(null);
  const [NIC, setNIC] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  // pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalRows, setTotalRows] = useState(0);

  const fetchAdmins = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/admins`, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search,
        },
      });

      setAdmins(res.data.data);
      setTotalRows(res.data.total);
    } catch (err) {
      toast.error("Failed to load admins");
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, [page, rowsPerPage, search]);

  const editAdmin = (admin) => {
    setEditingId(admin.admin_id);
    setNIC(admin.NIC);
    setName(admin.name);
    setPhone(admin.phone);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_BASE}/api/admins/${editingId}`, {
        NIC,
        name,
        phone,
      });
      toast.success("Admin updated successfully");
      setEditingId(null);
      fetchAdmins();
    } catch {
      toast.error("Update failed");
    }
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;

    try {
      await axios.delete(`${API_BASE}/api/admins/${id}`);
      toast.success("Admin deleted");
      fetchAdmins();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="manage-admin">
      <h2>Manage Admins</h2>

      {/* TOP BAR */}
      <div className="subjects-top-bar">
        <input
          className="search"
          placeholder="Search admin..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
        />

        <button
          className="add-btn"
          onClick={() => navigate("/dashboard/admin/add-admin")}
        >
          + Add Admin
        </button>
      </div>

      {/* TABLE */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>NIC</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Email</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {admins.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin) => (
                <TableRow key={admin.admin_id}>
                  <TableCell>{admin.admin_id}</TableCell>
                  <TableCell>{admin.NIC}</TableCell>
                  <TableCell>{admin.name}</TableCell>
                  <TableCell>{admin.phone}</TableCell>
                  <TableCell>{admin.username}</TableCell>
                  <TableCell>{admin.email}</TableCell>
                  <TableCell align="center">
                    <div className="action-buttons">
                      <Tooltip title="Edit">
                        <IconButton
                          color="primary"
                          onClick={() => editAdmin(admin)}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title="Delete">
                        <IconButton
                          color="error"
                          onClick={() => deleteAdmin(admin.admin_id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
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
      {editingId && (
        <form onSubmit={submit} className="admin-card">
          <h3>Edit Admin</h3>

          <div className="form-row">
            <label>NIC</label>
            <input value={NIC} readOnly />
          </div>

          <div className="form-row">
            <label>Name</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-row">
            <label>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="save-btn">
              Update Admin
            </button>
            <button
              type="button"
              className="cancel-btn"
              onClick={() => setEditingId(null)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
