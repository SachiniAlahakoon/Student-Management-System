import "./ManageSubjects.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ManageSubjects() {
   const navigate = useNavigate(); 
  const [subjects, setSubjects] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);

  // 🔍 search
  const [searchTerm, setSearchTerm] = useState("");

  // 🔢 pagination
  const [currentPage, setCurrentPage] = useState(1);
  const subjectsPerPage = 5;

  // Fetch subjects
  const fetchSubjects = async () => {
    const res = await axios.get(`${API_BASE}/api/subjects`);
    setSubjects(res.data);
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  // 🔍 FILTER SUBJECTS
  const filteredSubjects = subjects.filter((s) =>
    (
      s.Subject_ID +
      s.Subject_Name +
      s.Subject_Teacher_Name
    )
      .toString()
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  // 🔢 PAGINATION LOGIC
  const totalPages = Math.ceil(filteredSubjects.length / subjectsPerPage) || 1;
  const lastIndex = currentPage * subjectsPerPage;
  const firstIndex = lastIndex - subjectsPerPage;
  const currentSubjects = filteredSubjects.slice(firstIndex, lastIndex);

  // Reset page when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Edit input change
  const handleChange = (e) => {
    setEditingSubject({
      ...editingSubject,
      [e.target.name]: e.target.value,
    });
  };

  // ✏️ UPDATE SUBJECT
  const updateSubject = async () => {
    try {
      await axios.put(
        `${API_BASE}/api/subjects/${editingSubject.Subject_ID}`,
        editingSubject
      );

      toast.success("Subject updated successfully ✅");

      setEditingSubject(null);
      fetchSubjects();
    } catch (err) {
      toast.error("Failed to update subject");
    }
  };

  // ❌ DELETE SUBJECT
  const deleteSubject = async (id) => {
    if (!window.confirm("Delete this subject?")) return;

    try {
      await axios.delete(`${API_BASE}/api/subjects/${id}`);

      toast.success("Subject deleted successfully 🗑️");

      fetchSubjects();
    } catch (err) {
      toast.error("Failed to delete subject");
    }
  };

  return (
    <div className="content">
      <h2>Manage Subjects</h2>
  
      <div className="subjects-top-bar">
  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <button
    type="button"
    onClick={() => navigate("/dashboard/admin/add-subject")}
  >
    + Add Subject
  </button>
</div>

  
     

      {/* TABLE */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Subject ID</th>
            <th>Subject Name</th>
            <th>Teacher Name</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentSubjects.length > 0 ? (
            currentSubjects.map((s) => (
              <tr key={s.Subject_ID}>
                <td>{s.Subject_ID}</td>
                <td>{s.Subject_Name}</td>
                <td>{s.Subject_Teacher_Name}</td>
                <td>
                  <button onClick={() => setEditingSubject(s)}>Edit</button>{" "}
                  <button onClick={() => deleteSubject(s.Subject_ID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" align="center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* 🔢 PAGINATION */}
      <div className="pagination">
  <button
    disabled={currentPage <= 1}
    onClick={() => setCurrentPage((prev) => prev - 1)}
  >
    Prev
  </button>

  <span>
    Page {currentPage} of {totalPages}
  </span>

  <button
    disabled={currentPage >= totalPages}
    onClick={() => setCurrentPage((prev) => prev + 1)}
  >
    Next
  </button>
</div>


      {/* ✏️ EDIT FORM */}
      {editingSubject && (
        <div className="edit-form-card">
          <h3>Edit Subject</h3>

          <div className="form-row">
            <label>Subject Name</label>
            <input
              name="Subject_Name"
              value={editingSubject.Subject_Name}
              onChange={handleChange}
            />
          </div>

          <div className="form-row">
            <label>Teacher Name</label>
            <input
              name="Subject_Teacher_Name"
              value={editingSubject.Subject_Teacher_Name}
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
