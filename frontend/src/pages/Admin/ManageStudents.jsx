import { useEffect, useState } from "react";
import axios from "axios";
import { API_BASE } from "../../api/config";

export default function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [editingStudent, setEditingStudent] = useState(null);

  const [newStudent, setNewStudent] = useState({
    registration_number: "",
    name: "",
    email: "",
    grade: "",
  });

  // Fetch students
  const fetchStudents = async () => {
    const res = await axios.get(`${API_BASE}/api/students`);
    setStudents(res.data);
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle input change (add + edit)
  const handleChange = (e, type = "new") => {
    if (type === "edit") {
      setEditingStudent({
        ...editingStudent,
        [e.target.name]: e.target.value,
      });
    } else {
      setNewStudent({
        ...newStudent,
        [e.target.name]: e.target.value,
      });
    }
  };

  // Add student
  const addStudent = async () => {
    if (!newStudent.registration_number || !newStudent.name) {
      alert("Registration number and name are required");
      return;
    }

    await axios.post(`${API_BASE}/api/students`, newStudent);
    setNewStudent({
      registration_number: "",
      name: "",
      email: "",
      grade: "",
    });
    fetchStudents();
  };

  // Update student
  const updateStudent = async () => {
    await axios.put(
      `${API_BASE}/api/students/${editingStudent.id}`,
      editingStudent
    );
    setEditingStudent(null);
    fetchStudents();
  };

  // Delete student
  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student?")) return;
    await axios.delete(`${API_BASE}/api/students/${id}`);
    fetchStudents();
  };

  return (
    <div className="content">
      <h2>Manage Students</h2>

      {/* ADD STUDENT FORM */}
      <h3>Add New Student</h3>

      <input
        name="registration_number"
        placeholder="Registration Number"
        value={newStudent.registration_number}
        onChange={handleChange}
      />

      <input
        name="name"
        placeholder="Name"
        value={newStudent.name}
        onChange={handleChange}
      />

      <input
        name="email"
        placeholder="Email"
        value={newStudent.email}
        onChange={handleChange}
      />

      <input
        name="grade"
        placeholder="Grade"
        value={newStudent.grade}
        onChange={handleChange}
      />

      <button onClick={addStudent}>Add Student</button>

      <br /><br />

      {/* STUDENT TABLE */}
      <table width="100%" border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Reg. No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Grade</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {students.map((s) => (
            <tr key={s.id}>
              <td>{s.id}</td>
              <td>{s.registration_number}</td>
              <td>{s.name}</td>
              <td>{s.email}</td>
              <td>{s.grade}</td>
              <td>
                <button onClick={() => setEditingStudent(s)}>Edit</button>{" "}
                <button onClick={() => deleteStudent(s.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EDIT FORM */}
      {editingStudent && (
        <div style={{ marginTop: "20px" }}>
          <h3>Edit Student</h3>

          <input
            name="name"
            value={editingStudent.name}
            onChange={(e) => handleChange(e, "edit")}
          />

          <input
            name="email"
            value={editingStudent.email}
            onChange={(e) => handleChange(e, "edit")}
          />

          <input
            name="grade"
            value={editingStudent.grade}
            onChange={(e) => handleChange(e, "edit")}
          />

          <button onClick={updateStudent}>Update</button>
          <button onClick={() => setEditingStudent(null)}>Cancel</button>
        </div>
      )}
    </div>
  );
}
