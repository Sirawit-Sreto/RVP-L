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


app.get("/", (req, res) => {
  res.json({ message: "Backend is running " });
});


app.get("/test-health/:table", async (req, res) => {
  const table = req.params.table;
  
  try {
    const isAvailable = await genericService.check_table_available(table);
    
    if (isAvailable) {
      console.log("[SUCCESS] PostgreSQL is ready for table: " + table);
      return res.status(200).json({ 
        status: "OK", 
        message: "Table : "+table+" is ready." 
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
app.get("/users/list", async (req, res) => {
  try {
    console.log("service");
    const result = await genericService.get_table_data("users");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

app.get("/config/list", async (req, res) => {
  try {
    console.log("service")
    const result = await genericService.getConfigList();
    console.log("333")
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
});



// ยังไม่ได้ test
// app.post("/config/update", async (req, res) => {
//   try {
//     const { id, value } = req.body;
//     const updatedConfig = await genericService.updateConfig('config', id, value);
//     return res.json(updatedConfig);
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ error: err.message, code: err.code });
//   }
// });

app.use("/:table([A-Za-z0-9_]+)", genericRouter);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});