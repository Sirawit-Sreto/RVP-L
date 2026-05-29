const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
require("dotenv").config();

const app = express();
const db = require("./db");

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);
const genericRouter = require("./routes/genericRouter");
app.use("/api/:table", genericRouter);
app.use("/health-check-status", () => {});

app.get("/", (req, res) => {
  res.json({ message: "Backend is running " });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
