const express = require("express");
const router = express.Router({ mergeParams: true });
const db = require("../db");
const genericService = require("../services/genericService");
const authenticateToken = require('../middlewares/auth');


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
  const table = req.params.table || req.path.split('/').filter(Boolean)[0];
  console.log("checkTableAvailable ->", table);
  if (!table || table === '.well-known') {
    return res.status(404).json({
      success: false,
      message: "Resource not found or invalid route parameter."
    });
  }
  try {
      await genericService.check_table_available(table);
      req.validatedTable = table;
      next(); 
    } catch (error) {
      return res.status(error.status || 404).json({
        success: false,
        message: error.message
      });
}
};

router.get('/:table/list', authenticateToken, getAllTable);
router.get('/:table/:id', authenticateToken, getById);
router.post('/:table/add', authenticateToken, createByTable);// -- ตอนนี้ยังคงต้องเพิ่มใน postman อยู่
router.post('/:table/disable/:id', authenticateToken, disableById);// -- ตอนนี้ยังคงต้องเพิ่มใน postman อยู่




async function getAllTable(req, res) {
  const table = req.validatedTable || (req.params && req.params.table ? req.params.table : null) || (req && req.path ? req.path.split('/').filter(Boolean)[0] : '');
  console.log('GET ' + table + ' all');
  try {
    await genericService.check_table_available(table);
    const result = await genericService.get_table_data(table);
    return res.json(result);
  } catch (err) {
    console.error(err);
    if (res && typeof res.status === 'function') {
      return res.status(500).json({ error: err.message, code: err.code });
    }
  }
}

async function getById(req, res) {
  const id = req.params.id;
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  console.log('GET BY ID ->', table, id);

  try {
    await genericService.check_table_available(table);
    const result = await genericService.check_id(table, id);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
}

async function createByTable(req, res) {
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  console.log('CREATE ->', table);

  try {
    await genericService.check_table_available(table);
    const body = req.body || {};
    if (Object.keys(body).length === 0) {
      return res.status(400).json({ error: 'missing request body' });
    }
    const result = await genericService.insert_table_data(table, body);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
}

async function disableById(req,res) {
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  const id = req.params.id;
  console.log('DISABLE ->', table,'id', id);

  try{
    await genericService.check_table_available(table);
    const body = req.body
    const result = await genericService.disable_table_data(table, id);
    return res.json(result);
  }catch (err) {
    console.error(err);
    const statusCode = err.status || 500;
    return res.status(statusCode).json({ error: err.message, code: err.code });
  }
}


module.exports = router;