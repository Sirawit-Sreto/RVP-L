const express = require('express');
const cors = require('cors');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
const db = require('./db');

// Middlewares
app.use(cors());
app.use(express.json());

// นำเราเตอร์ API มาผูกพ่วงใช้งาน
app.use('/api', apiRoutes);

// หน้าแรกทดสอบระบบสถานะเซิร์ฟเวอร์
app.get('/', (req, res) => {
  res.json({ message: "Backend is running " });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});