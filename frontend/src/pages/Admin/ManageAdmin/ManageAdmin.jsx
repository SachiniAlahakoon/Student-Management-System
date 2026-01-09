import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import "./ManageAdmin.css";

export default function ManageAdmin() {
  const [admins, setAdmins] = useState([]);
  const [search, setSearch] = useState("");

  // form states
  const [NIC, setNIC] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [editingId, setEditingId] = useState(null);

  const fetchAdmins = async () => {
    const res = await axios.get(`${API_BASE}/api/admins`);
    setAdmins(res.data);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // ADD or UPDATE
  const submit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        // UPDATE
        await axios.put(`${API_BASE}/api/admins/${editingId}`, {
          NIC,
          name,
          phone,
        });
        toast.success("Admin updated");
      } else {
        // ADD
        await axios.post(`${API_BASE}/api/admins`, {
          NIC,
          name,
          phone,
        });
        toast.success("Admin added");
      }

      setNIC("");
      setName("");
      setPhone("");
      setEditingId(null);
      fetchAdmins();
    } catch (err) {
      toast.error("Operation failed");
    }
  };

  const editAdmin = (admin) => {
    setEditingId(admin.id);
    setNIC(admin.NIC);
    setName(admin.name);
    setPhone(admin.phone);
  };

  const deleteAdmin = async (id) => {
    if (!window.confirm("Delete this admin?")) return;
    await axios.delete(`${API_BASE}/api/admins/${id}`);
    toast.success("Admin deleted");
    fetchAdmins();
  };

  const filtered = admins.filter(a =>
    (a.name + a.NIC + a.phone)
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="manage-admin">
      <h2>Manage Admins</h2>

      {/* ADD / UPDATE ADMIN FORM */}
<form onSubmit={submit} className="admin-card">
  <div className="form-row">
    <label>NIC</label>
    <input
      type="text"
      value={NIC}
      onChange={(e) => setNIC(e.target.value)}
      required
    />
  </div>

  <div className="form-row">
    <label>Name</label>
    <input
      type="text"
      value={name}
      onChange={(e) => setName(e.target.value)}
      required
    />
  </div>

  <div className="form-row">
    <label>Phone</label>
    <input
      type="number"
      value={phone}
      onChange={(e) => setPhone(e.target.value)}
      required
    />
  </div>

  <div className="form-buttons">
    <button type="submit" className="save-btn">
      {editingId ? "Update Admin" : "Save Admin"}
    </button>

    <button
      type="button"
      className="cancel-btn"
      onClick={() => {
        setEditingId(null);
        setNIC("");
        setName("");
        setPhone("");
      }}
    >
      Cancel
    </button>
  </div>
</form>


      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search admin..."
        value={search}
        onChange={e => setSearch(e.target.value)}
      />

      {/* TABLE */}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NIC</th>
            <th>Name</th>
            <th>Phone</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map(admin => (
            <tr key={admin.id}>
              <td>{admin.id}</td>
              <td>{admin.NIC}</td>
              <td>{admin.name}</td>
              <td>{admin.phone}</td>
              <td>
                <div className="action-buttons">
                <button onClick={() => editAdmin(admin)}>Edit</button>
                <button
                  className="delete-btn"
                  onClick={() => deleteAdmin(admin.id)}
                >
                  Delete
                </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
