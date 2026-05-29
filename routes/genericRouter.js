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
  console.log("checkTableAvailable", table);

  try {
    const result = await genericService.check_table_available(table);
    next();
  } catch (error) {
    res
      .status(503)
      .json({ error: `Table ${table} Network Error: ${error.message}` });
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
  const table = req.params.table;
  const id = req.params.id;
  const pk = tablePK[table];
  try {
    let queryText = `SELECT * FROM ${table} WHERE ${pk} = $1`;
    const { rows } = await db.query(queryText, [id]);

    if (rows.length === 0) {
      // สำหรับที่ไม่มี id
      return res.status(404).json({
        error: `Table: ${table} you are looking for was not found`,
      });
    }
    const projectData = rows[0];

    if (projectData.is_deleted === true) {
      return res.status(410).json({
        // สำหรับ is_deleted = true
        message: `ID ${id} exists, but it has been deleted from the table : ${table} `,
        data: projectData,
      });
    }

    return res.json(projectData); //สำหรับคนที่มี id และไม่ได้ถูกลบออก
  } catch (err) {
    return res.status(500).json({ error: err.message }); // สำรหับ error เช่นพิมพ์คำสั่งผิดหากกด send ใน postman จะแสดงว่าผิดยังไง
  }
});

// 3. DELETE /api/:table and users/:id -> ลบข้อมูล
router.delete("/:id", async (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const pk = tablePK[table];

  try {
    let result;

    if (table === "projects" || table === "users") {
      result = await db.query(
        `UPDATE ${table} SET is_deleted = true WHERE ${pk} = $1 AND is_deleted = false RETURNING *`,
        [id],
      );
    } else {
      result = await db.query(
        `DELETE FROM ${table} WHERE ${pk} = $1 RETURNING *`,
        [id],
      );
    }

    const rows = result.rows;

    if (!rows || rows.length === 0) {
      return res.status(404).json({
        error: `The item with ID ${id} in table "${table}" was not found, or it was already deleted!`,
      });
    }

    const deletedItem = rows[0];

    if (table === "projects" || table === "users") {
      return res.status(200).json({
        success: true,
        message: `The ${table} with ID ${id} was marked as deleted successfully`,
        deletedItem,
      });
    }

    return res.json({
      success: true,
      message: `The ${table} with ID ${id} was deleted successfully`,
      deletedItem: deletedItem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
