require("dotenv").config();
require("./config/db");

const express = require("express");
const cors = require("cors");

const app = express();

// MIDDLEWARE
app.use(cors());
app.use(express.json());

// TEST
app.get("/", (req, res) => {
  res.send("Student Management Backend running");
});

// ROUTES
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/users.routes"));
app.use("/api/admins", require("./routes/admin.routes"));

app.use("/api/students", require("./routes/student.routes"));
app.use("/api/teachers", require("./routes/teacher.routes"));

app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/marks", require("./routes/marks.routes"));
app.use("/api/reports", require("./routes/reports.routes"));
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/subjects", require("./routes/subject.routes"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
