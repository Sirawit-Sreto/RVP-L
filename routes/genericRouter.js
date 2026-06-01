const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");
const genericService = require("../services/genericService");


const tablePK = {
  task: "task_id",
  outsource: "user_out_id",
  users: "user_id",
  roles: "role_id",
  cr: "cr_id",
  request: "req_id",
  projects: "project_id",
  status: "status_id",
  tags: "tag_id",
  category: "category_id",
  types: "type_id",
  department: "department_id",
  position: "position_id",
  config: "config_id",
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

// 1. GET /api/:table -> ดึงข้อมูลทั้งหมดในตารางนั้นๆ
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

// 2. GET /api/:table/:id -> ดึงข้อมูลทีละตัวด้วย ID
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

// 3. DELETE /api/:table/:id -> ลบข้อมูลทีละตัวด้วย ID
router.delete("/:id", async (req, res) => {
  const { table, id } = req.params;
  console.log("DELETE ->", table, id);

  try {
  const result = await genericService.delete_table_from_dataId(table, id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;