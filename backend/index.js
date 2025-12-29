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
const studentRoutes = require('./routes/student.routes');
const teacherRoutes = require("./routes/teacher.routes");
app.use('/api/auth', authRoutes);
app.use('/api/students', studentRoutes);
app.use("/api/teachers", teacherRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
// connectDB();