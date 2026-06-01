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

// 0. Check Table Available
const check_table_available = async (table) => {
  const checkQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = $1
  `;
  const { rows } = await db.query(checkQuery, [table]);

  // ถ้าไม่เจอตารางในระบบ
  if (rows.length === 0) {
    const error = new Error(`Table does not exist in the database.`);
    error.status = 404;
    throw error;
  }

  return table;
}

// 1. GET ดึงข้อมูลทั้งหมด
const get_table_data = async (table) => {
  let queryText = `SELECT * FROM @table`;
  // เอาไว้เผื่อตอนที่ไม่ต้องการให้โชว์คนที่โดนลบออกไปแล้ว
  // if (table === "projects" || table === "users") {
  //   queryText += ` WHERE is_deleted = false`;
  // }
  queryText += ` ORDER BY ${tablePK[table]} DESC LIMIT 100`;
  queryText = queryText.replace('@table', table);
  const { rows } = await db.query(queryText);
  return rows;
};

// // 2. GET ดึงข้อมูลตาม ID
async function get_table_from_dataId(table, id) {
  let queryText = `SELECT * FROM @table WHERE ${tablePK[table]} = $1`;
  queryText = queryText.replace('@table', table);
  const { rows } = await db.query(queryText, [id]);
  const data = rows[0];
  return data;
};

// 3. DELETE ลบข้อมูลตาม ID
async function delete_table_from_dataId(table, id) {
  let queryText = `UPDATE @table SET is_deleted = true WHERE ${tablePK[table]} = $1 AND is_deleted = false RETURNING *`;
  queryText = queryText.replace('@table', table);
  const { rows } = await db.query(queryText, [id]);
  const data = rows[0];
  return data;
};

module.exports = {
  check_table_available,
  get_table_data,
  get_table_from_dataId,
  delete_table_from_dataId,
};