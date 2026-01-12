const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance.routes');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/attendance', attendanceRoutes);

// simple route
app.get('/', (req, res) => res.send('Student Management Backend running'));

// routes
const authRoutes = require('./routes/auth.routes');
const studentRoutes = require("./routes/student.routes");
const teacherRoutes = require("./routes/teacher.routes");
const marksRoutes = require("./routes/marks.routes");
const reportRoutes = require("./routes/reports.routes");

app.use('/api/auth', authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/teacher", teacherRoutes);
app.use("/api/teacher/marks", marksRoutes);
app.use("/api/reports", reportRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
