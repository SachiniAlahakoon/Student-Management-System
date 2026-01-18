require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// simple route
app.get('/', (req, res) => res.send('Student Management Backend running'));

// routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const marksRoutes = require("./routes/marks.routes");
const reportRoutes = require("./routes/reports.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const profileRoutes = require('./routes/profile.routes');
const adminRoutes = require("./routes/admin.routes");
const studentMgmtRoutes = require("./routes/student_mgmt.routes");
const teacherMgmtRoutes = require("./routes/teacher_mgmt.routes");
const subjectRoutes = require("./routes/subject.routes");
const userRoutes = require("./routes/users.routes");







app.use("/api/users", userRoutes);
app.use("/api/subjects", subjectRoutes);
app.use("/api/teachers", teacherMgmtRoutes);
app.use("/api/students", studentMgmtRoutes);
app.use("/api/admins", adminRoutes);
app.use('/api/auth', authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/students/attendance", attendanceRoutes);
app.use("/api/teacher/marks", marksRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/reports", reportRoutes);
app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
// connectDB();