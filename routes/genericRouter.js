const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");
const genericService = require("../services/genericService");
const { getconfig } = require("../services/genericService");


const get_primary_key_name = async (table) => {
  const pkQuery = `
    SELECT a.attname AS pk
    FROM pg_index i
    JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
    WHERE i.indrelid = $1::regclass AND i.indisprimary;
  `;
  
  const { rows } = await db.query(pkQuery, [table]);
  return rows[0].pk;
};

async function checkTableAvailable(req, res, next) {
  const table = req.params.table;
  console.log("checkTableAvailable ->", table);

  try {
    await genericService.check_table_available(table);
    next();
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
}

router.use(checkTableAvailable);

// 1. GET /:table -> ดึงข้อมูลทั้งหมดในตารางนั้นๆ
router.get("/", async (req, res) => {
  const table = req.params.table;
  console.log("GET "+table+" all");
  try {
    const result = await genericService.get_table_data(table);
    res.json(result);
  } catch (err) {
    console.log(err.code);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

// 2. GET /:table/:id -> ดึงข้อมูลทีละตัวด้วย ID
router.get("/:id", async (req, res) => {
  const { table, id } = req.params;
  console.log("GET BY ID ->", table, id);
  try {
    const result = await genericService.check_id(table, id);
    res.json(result);
  } catch (err) {
    console.log(err.code);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

// 3. DELETE /:table/:id -> ลบข้อมูลทีละตัวด้วย ID
router.delete("/:id", async (req, res) => {
  const { table, id } = req.params;
  console.log("DELETE ->", table, id);

  try {
  const result = await genericService.delete_table_from_dataId(table, id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message, code: err.code });
  }
});

// รอแก้ไข userlist
// router.get("/users/list", async (req, res) => {
//   try {
//     const result = await genericService.get_table_data("users");
//     console.log("111");
//     res.json(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message, code: err.code });
//   }
// });

// router.post("/users/add"), async (req, res) => {
// };

// router.post("/users/update"), async (req, res) => {
// };

// router.post("/users/disable"), async (req, res) => {
// };

// router.get("/projects/list"), async (req, res) => {
// };

// router.post("/projects/add"), async (req, res) => {
// };

// router.post("/projects/update"), async (req, res) => {
// };

// router.post("/projects/disable"), async (req, res) => {
// };


// รอแก้ไข config
router.get("/config/list", async (req, res) => { 
  try{


  }
  // const configList = await genericService.getConfigList();
  // console.log("444")
  // res.json(configList);
 catch (err) {
  console.error(err);
  res.status(500).json({ error: err.message, code: err.code });
}});

// router.post("/config/update", async (req, res) => {
//   const { id, value } = req.body;
//   try {
//     const updatedConfig = await genericService.updateConfig('config', id, value);
//     res.json(updatedConfig);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: err.message, code: err.code });
//   }
// });


module.exports = router;