
import "./ManageStudents.css";

import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../../api/config";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./ManageStudents.css";

export default function ManageStudents() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  //  search
  const [searchTerm, setSearchTerm] = useState("");

  //  pagination
  const [currentPage, setCurrentPage] = useState(1);
  const studentsPerPage = 5;

  // Fetch students
  const fetchStudents = async () => {
    const res = await axios.get(`${API_BASE}/api/students`);
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  //  FILTER STUDENTS
  const filteredStudents = students.filter((s) =>
    (
      s.registration_number +
      s.name +
      s.class +
      s.address +
      s.age
    )
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  //  PAGINATION LOGIC
 const totalPages = Math.ceil(filteredStudents.length / studentsPerPage) || 1;

  const lastIndex = currentPage * studentsPerPage;
  const firstIndex = lastIndex - studentsPerPage;
  const currentStudents = filteredStudents.slice(firstIndex, lastIndex);

  // Reset to page 1 when searching
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Edit logic
  const handleChange = (e) => {
    setEditingStudent({
      ...editingStudent,
      [e.target.name]: e.target.value,
    });
  };

  
  const updateStudent = async () => {
  try {
    await axios.put(
      `${API_BASE}/api/students/${editingStudent.registration_number}`,
      editingStudent
    );

    toast.success("Student updated successfully ✅");

    setEditingStudent(null);
    fetchStudents();
  } catch (err) {
    toast.error("Failed to update student");
  }
};


 
  const deleteStudent = async (regNo) => {
  if (!window.confirm("Delete this student?")) return;

  try {
    await axios.delete(`${API_BASE}/api/students/${regNo}`);

    toast.success("Student deleted successfully 🗑️");

    fetchStudents();
  } catch (err) {
    toast.error("Failed to delete student");
  }
};


  return (
    <div className="content">
      <h2>Manage Students</h2>

      {/* TOP CONTROLS */}
      <div className="subjects-top-bar">
  <input
    type="text"
    placeholder="Search..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
  />

  <button
    type="button"
    onClick={() => navigate("/dashboard/admin/add-student")}
  >
    + Add Student
  </button>
</div>

      {/* TABLE */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Reg. No</th>
            <th>Name</th>
            <th>Class</th>
            <th>Address</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {currentStudents.length > 0 ? (
            currentStudents.map((s) => (
              <tr key={s.registration_number}>
                <td>{s.registration_number}</td>
                <td>{s.name}</td>
                <td>{s.class}</td>
                <td>{s.address}</td>
                <td>{s.age}</td>
                <td>
                   <button onClick={() => navigate(`/dashboard/admin/view-student/${s.registration_number}`)}>View </button>{" "}
                  <button onClick={() => setEditingStudent(s)}>Edit</button>{" "}
                  <button onClick={() => deleteStudent(s.registration_number)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" align="center">
                No records found
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/*  PAGINATION */}
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



      {/* EDIT FORM */}
      {editingStudent && (
  <div className="edit-form-card">
    <h3>Edit Student</h3>

    <div className="form-row">
      <label>Name</label>
      <input
        name="name"
        value={editingStudent.name}
        onChange={handleChange}
      />
    </div>

    <div className="form-row">
      <label>Class</label>
      <input
        name="class"
        value={editingStudent.class}
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
  <label>Date of Birth</label>
  <input
    type="date"
    name="dob"
    value={editingStudent.dob?.split("T")[0] || ""}
    onChange={handleChange}
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
