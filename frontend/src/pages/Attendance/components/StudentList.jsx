function StudentList({ selectedClass }) {
  const students = [
    "Amaya Perera",
    "Nethmi Silva",
    "Sahan Fernando",
    "Kasun Jayasinghe",
  ];

  return (
    <div>
      <h3>{selectedClass} - Student List</h3>
      <ul>
        {students.map((student, index) => (
          <li key={index}>{student}</li>
        ))}
      </ul>
    </div>
  );
}

export default StudentList;
