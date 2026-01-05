const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const attendanceRoutes = require('./routes/attendance');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/attendance', attendanceRoutes);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
