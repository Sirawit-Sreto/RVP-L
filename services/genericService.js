const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");

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

// 0. Check Table Available
const check_table_available = async (table) => {
  const checkQuery = `
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public' AND table_name = $1
  `;
  const { rows } = await db.query(checkQuery, [table]);

  // ถ้าไม่เจอตารางในdatabase
  if (rows.length === 0) {
    const error = new Error('Table ' + table + ' does not exist or has no Primary Key.');
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
  queryText += ` ORDER BY ${await get_primary_key_name(table)} DESC LIMIT 100`;
  queryText = queryText.replace('@table', table);
  const { rows } = await db.query(queryText);
  console.log('get table');
  return rows;
};




// // 2. GET ดึงข้อมูลตาม ID
async function get_table_from_dataId(table, id) {
  const pk = await get_primary_key_name(table);
  let queryText = `SELECT * FROM @table WHERE @pk = $1`;
  queryText = queryText.replace('@table', table);
  queryText = queryText.replace('@pk', pk);
  const { rows } = await db.query(queryText, [id]);
  const data = rows[0];
  return data;
};

// // 3. DELETE ลบข้อมูลตาม ID
async function delete_table_from_dataId(table, id) {
  const pk = await get_primary_key_name(table);
  let queryText = `UPDATE @table SET is_deleted = true WHERE @pk = $1 AND is_deleted = false RETURNING *`;
  queryText = queryText.replace('@table', table);
  queryText = queryText.replace('@pk', pk);
  const { rows } = await db.query(queryText, [id]);
  const data = rows[0];
  return data;
};

// // 4. Check ID ว่ามีในตารางไหม
async function check_id(table, id) {
  const data = await get_table_from_dataId(table, id);
  if (!data) {
    throw {
      code: 404,
      message: `not found ID: @id in table: @table`
        .replace('@id', id)
        .replace('@table', table)
    };
  }
  return data;
};

async function getConfigList(table) {
  const dataconfig = await get_table_data('config');
  console.log("222")
  return dataconfig;
}

// ยังไม่ได้ test
// async function updateConfig(table, id, value) {
//   const data = await get_table_data('config');
//   const pk = await get_primary_key_name('config');
//   let queryText = `UPDATE @table SET value = $1 WHERE @pk = $2 RETURNING *`;
//   queryText = queryText.replace('@table', 'config');
//   queryText = queryText.replace('@pk', pk);
//   const { rows } = await db.query(queryText, [value, id]);
//   const updatedData = rows[0];
//   return updatedData;
// }



module.exports = {
  check_table_available,
  get_table_data,
  get_table_from_dataId,
  delete_table_from_dataId,
  check_id,
  getConfigList,
  // updateConfig
};