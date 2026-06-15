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
  console.log('Table ' + table + ' is available.');
  return table;
}

// 1. GET ดึงข้อมูลทั้งหมด
const get_table_data = async (table) => {
  let queryText = `SELECT * FROM @table`;
  queryText += ` ORDER BY ${await get_primary_key_name(table)} DESC LIMIT 100`;
  queryText = queryText.replace('@table', table);
  const { rows } = await db.query(queryText);
  console.log('show ' + table);
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
  console.log('show ' + table + ' from id');
  return data;
};

// 3. เพิ่มข้อมูลใหม่ในตาราง
async function insert_table_data(table, insertData) {
  const columns = Object.keys(insertData);
  if (columns.length === 0) {
    throw { code: 400, message: 'No data provided for insert' };
  }
  const values = Object.values(insertData);
  const placeholders = columns.map((_, i) => `$${i + 1}`).join(', ');

  let queryText = `INSERT INTO @table (${columns.join(', ')}) VALUES (${placeholders}) RETURNING *`;
  queryText = queryText.replace('@table', table);

  const { rows } = await db.query(queryText, values);
  const data = rows[0];
  console.log('inserted data into ' + table);
  return data;
};

// 4. Check ID ว่ามีในตารางไหม
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

// 5. disable by ID (soft delete)
async function disable_table_data(table, id) {
  const pk = await get_primary_key_name(table);
  let queryText = `UPDATE @table SET is_deleted = true WHERE @pk = $1 RETURNING *`;
  queryText = queryText.replace('@table', table);
  queryText = queryText.replace('@pk', pk);

  const { rows } = await db.query(queryText, [id]);
  if (rows.length === 0) {
    const error = new Error(`not found ID: ${id} in table: @table`.replace('@table', table));
    error.status = 404;
    throw error;
  }

  const data = rows[0];
  console.log('Successfully disabled data from ' + table);
  return data;
}


module.exports = {
  check_table_available,
  get_table_data,
  get_table_from_dataId,
  insert_table_data,
  check_id,
  disable_table_data,
};