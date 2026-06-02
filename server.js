const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const app      = express();
const apiRoutes = require('./routes/api');

app.use(cors());
app.use(express.json());

app.use('/api', apiRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'RVP Library Backend is running', port: process.env.PORT || 5000 });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
