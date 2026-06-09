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
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  console.log("checkTableAvailable ->", table);
  if (table && table.startsWith('.')) {
    console.log('checkTableAvailable: skipping dot-prefixed path ->', table);
    return next();
  }
  try {
    await genericService.check_table_available(table);
    next();
  } catch (error) {
    const statusCode = error.status || 500;
    return res.status(statusCode).json({ error: error.message });
  }
}

// Route declarations 
router.get('/users/list', getAllTable);
router.get('/outsource/list', getAllTable);
router.get('/projects/list', getAllTable);
router.get('/roles/list', getAllTable);
router.get('/status/list', getAllTable);
router.get('/cr/list', getAllTable);
router.get('/request/list', getAllTable);
router.get('/task/list', getAllTable);
router.get('/config/list', getAllTable);
// children of config
router.get('/department/list', getAllTable);
router.get('/type/list', getAllTable);
router.get('/category/list', getAllTable);
router.get('/position/list', getAllTable);
router.get('/tags/list', getAllTable);


// get by ID
router.get('/users/:id', getById);
router.get('/outsource/:id', getById);
router.get('/projects/:id', getById);
router.get('/roles/:id', getById);
router.get('/status/:id', getById);
router.get('/cr/:id', getById);
router.get('/request/:id', getById);
router.get('/task/:id', getById);
router.get('/config/:id', getById);


// insert table by ID 
router.post('/users/update/:id', createByTable);
router.post('/outsource/update/:id', createByTable);
router.post('/projects/update/:id', createByTable);
router.post('/roles/update/:id', createByTable);
router.post('/status/update/:id', createByTable);
router.post('/cr/update/:id', createByTable);
router.post('/request/update/:id', createByTable);
router.post('/task/update/:id', createByTable);
router.post('/config/update/:id', createByTable);


async function getAllTable(req, res) {
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  console.log('GET ' + table + ' all');

  try {
    const result = await genericService.get_table_data(table);
    return res.json(result);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message, code: err.code });
  }
}

async function getById(req, res) {
  const id = req.params.id;
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  console.log('GET BY ID ->', table, id);

  try {
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


module.exports = router;