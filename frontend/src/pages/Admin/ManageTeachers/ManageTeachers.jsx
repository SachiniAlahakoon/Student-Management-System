import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./ManageTeachers.css";

export default function ManageTeachers() {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [editingTeacher, setEditingTeacher] = useState(null);

  const perPage = 5;

  // ================= FETCH TEACHERS =================
  const fetchTeachers = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/teachers`);
      setTeachers(res.data);
    } catch (err) {
      toast.error("Failed to load teachers");
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // ================= SEARCH =================
  const filtered = teachers.filter((t) =>
    (t.name + t.id_no + t.email)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  // ================= PAGINATION =================
  const totalPages = Math.ceil(filtered.length / perPage) ||1;
  const visible = filtered.slice((page - 1) * perPage, page * perPage);

  useEffect(() => {
    setPage(1);
  }, [search]);

  // ================= DELETE =================
  const deleteTeacher = async (id) => {
    if (!window.confirm("Delete this teacher?")) return;

    try {
      await axios.delete(`${API_BASE}/api/teachers/${id}`);
      toast.success("Teacher deleted successfully");
      fetchTeachers();
    } catch {
      toast.error("Failed to delete teacher");
    }
  };

  // ================= EDIT =================
  const handleChange = (e) => {
    setEditingTeacher({
      ...editingTeacher,
      [e.target.name]: e.target.value,
    });
  };

  const updateTeacher = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/teachers/${editingTeacher.t_id}`,
        editingTeacher
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

      {/* ================= TOP BAR ================= */}
      <div className="teachers-top-bar">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          type="button"
          onClick={() => navigate("/dashboard/admin/add-teacher")}
        >
          + Add Teacher
        </button>
      </div>

      {/* ================= TABLE ================= */}
      <table>
        <thead>
          <tr>
            <th>ID No</th>
            <th>Name</th>
            <th>Birthday</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {visible.length > 0 ? (
            visible.map((t) => (
              <tr key={t.t_id}>
                <td>{t.id_no}</td>
                <td>{t.name}</td>
                <td>{t.birthday?.split("T")[0]}</td>
                <td>{t.age}</td>
                <td>{t.phone}</td>
                <td>{t.email}</td>
                <td>
                  <button onClick={() => setEditingTeacher(t)}>Edit</button>{" "}
                  <button onClick={() => deleteTeacher(t.t_id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" align="center">
                No teachers found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* ================= PAGINATION ================= */}
      <div className="pagination">
  <button
    disabled={page <= 1}
    onClick={() => setPage((prev) => prev - 1)}
  >
    Prev
  </button>

  <span>
    Page {page} of {totalPages}
  </span>

  <button
    disabled={page >= totalPages}
    onClick={() => setPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>


      {/* ================= EDIT FORM ================= */}
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
              name="name"
              value={editingTeacher.name}
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

          <div className="form-row">
            <label>Program ID</label>
            <input
              name="p_in_id"
              value={editingTeacher.p_in_id}
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
