const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");

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
// 0. Check Table is Available

const check_table_available = async (table) => {
  const result_check_table = Object.prototype.hasOwnProperty.call(
    tablePK,
    table,
  );

  if (!result_check_table) {
    throw new Error(`Table : ${table} you are looking for was not found`);
  }

  await db.query("SELECT 1");
  return table;
};

// 1. GET /api/:table -> ดึงข้อมูลทั้งหมดในตารางนั้นๆ
const get_table_data = async (table) => {
  let queryText = `SELECT * FROM @table`;
  if (table === "projects" || table === "users") {
    // queryText += ` WHERE is_deleted = false`; เอาไว้เผื่อตอนที่ไม่ต้องการให้โชว์คนที่โดนลบออกไปแล้ว
  }
  queryText += ` ORDER BY ${tablePK[table]} DESC LIMIT 100`;

  const { rows } = await db.query(queryText, { table: table });
  return rows;
};

module.exports = {
  get_table_data,
  check_table_available,
};
