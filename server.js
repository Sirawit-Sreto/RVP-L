const express = require("express");
const cors = require("cors");
const apiRoutes = require("./routes/api");
require("dotenv").config();
const genericService = require("./services/genericService");



const app = express();
const db = require("./db");

app.use(cors());
app.use(express.json());

app.use("/api", apiRoutes);

app.get("/test-health/:table", async (req, res) => {
  const table = req.params.table;
  console.log("Checking health status for table:", table);
  
  try {
    const isAvailable = await genericService.check_table_available(table);
    
    if (isAvailable) {
      console.log("[SUCCESS] PostgreSQL is ready for table: " + table);
      return res.status(200).json({ 
        status: "OK", 
        message: "Table : " + table + " is ready." 
      });
    }
  } catch (error) {
    console.log('[SERVER ERROR] Table "' + table + '" failed health check: ' + error.message);
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ 
      error: "Table " + table + " failed system health check: " + error.message 
    });
  }
});

const genericRouter = require("./routes/genericRouter");
app.use("/:table", genericRouter);


app.get("/", (req, res) => {
  res.json({ message: "Backend is running " });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
