const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");
const genericService = require("../services/genericService");

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
  console.log("GET", table);

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
    const result = await genericService.get_table_from_dataId(table, id);
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

module.exports = router;