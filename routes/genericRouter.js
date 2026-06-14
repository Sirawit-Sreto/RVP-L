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
// check router
// router.use('/@table', checkTableAvailable);
router.get('/:table/list', authenticateToken, checkTableAvailable, getAllTable);

// router.post("/receiptType/add", wrapRouteWithDefaults(), (req, res) => {
//   fnRvpService(req, res, addReceiptType);
// });


// router.get('/:table/list', getAllTable);
// router.get('/:table/:id', getById);
// router.post('/:table/add', createByTable);
// router.post('/:table/disable/:id', disableById);

// Route declarations 
// roiute.get('/users/list', checkTableAvailable, getAllTable);
// router.get('/outsource/list', checkTableAvailable, getAllTable);
// router.get('/projects/list', checkTableAvailable, getAllTable);
// router.get('/roles/list', checkTableAvailable, getAllTable);
// router.get('/status/list', checkTableAvailable, getAllTable);
// router.get('/cr/list', checkTableAvailable, getAllTable);
// router.get('/request/list', checkTableAvailable, getAllTable);
// router.get('/task/list', checkTableAvailable, getAllTable);
// router.get('/config/list', checkTableAvailable, getAllTable);
// // children of config
// router.get('/department/list', checkTableAvailable, getAllTable);
// router.get('/type/list', checkTableAvailable, getAllTable);
// router.get('/category/list', checkTableAvailable, getAllTable);
// router.get('/position/list', checkTableAvailable, getAllTable);
// router.get('/tags/list', checkTableAvailable, getAllTable);


// get by ID
// router.get('/users/:id', checkTableAvailable, getById);
// router.get('/outsource/:id', checkTableAvailable, getById);
// router.get('/projects/:id', checkTableAvailable, getById);
// router.get('/roles/:id', checkTableAvailable, getById);
// router.get('/status/:id', checkTableAvailable, getById);
// router.get('/cr/:id', checkTableAvailable, getById);
// router.get('/request/:id', checkTableAvailable, getById);
// router.get('/task/:id', checkTableAvailable, getById);
// router.get('/config/:id', checkTableAvailable, getById);
// //children of config
// router.get('/department/:id', checkTableAvailable, getById);
// router.get('/type/:id', checkTableAvailable, getById);
// router.get('/category/:id', checkTableAvailable, getById);
// router.get('/position/:id', checkTableAvailable, getById);
// router.get('/tags/:id', checkTableAvailable, getById);


// insert table by ID 
// router.post('/users/add',checkTableAvailable, createByTable);
// router.post('/outsource/add', checkTableAvailable, createByTable);
// router.post('/projects/add', checkTableAvailable, createByTable);
// router.post('/roles/add', checkTableAvailable, createByTable);
// router.post('/status/add', checkTableAvailable, createByTable);
// router.post('/cr/add', checkTableAvailable, createByTable);
// router.post('/request/add', checkTableAvailable, createByTable);
// router.post('/task/add', checkTableAvailable, createByTable);
// router.post('/config/add', checkTableAvailable, createByTable);
// //children of config
// router.post('/department/add', checkTableAvailable, createByTable);
// router.post('/type/add', checkTableAvailable, createByTable);
// router.post('/category/add', checkTableAvailable, createByTable);
// router.post('/position/add', checkTableAvailable, createByTable);
// router.post('/tags/add', checkTableAvailable, createByTable);


//delete by Id (soft delete)
// router.post('/users/disable/:id', checkTableAvailable, disableById);
// router.post('/outsource/disable/:id', checkTableAvailable, disableById);
// router.post('/projects/disable/:id', checkTableAvailable, disableById);
// router.post('/roles/disable/:id', checkTableAvailable, disableById);
// router.post('/status/disable/:id', checkTableAvailable, disableById);
// router.post('/cr/disable/:id', checkTableAvailable, disableById);
// router.post('/request/disable/:id', checkTableAvailable, disableById);
// router.post('/task/disable/:id', checkTableAvailable, disableById);
// router.post('/config/disable/:id', checkTableAvailable, disableById);
// //children of config
// router.post('/department/disable/:id', checkTableAvailable, disableById);
// router.post('/type/disable/:id', checkTableAvailable, disableById);
// router.post('/category/disable/:id', checkTableAvailable, disableById);
// router.post('/position/disable/:id', checkTableAvailable, disableById);
// router.post('/tags/disable/:id', checkTableAvailable, disableById);


async function getAllTable(req, res) {
  // 💡 ปรับมาดึงจาก req.validatedTable ที่ Middleware หาไว้ให้แล้วได้เลย
  const table = req.validatedTable || (req.params && req.params.table ? req.params.table : null) || (req && req.path ? req.path.split('/').filter(Boolean)[0] : '');
  console.log('GET ' + table + ' all');

  try {
    const result = await genericService.get_table_data(table);
    return res.json(result);
  } catch (err) {
    console.error(err);
    // ตรวจสอบชัวร์ ๆ ว่ามีตัวแปร res ก่อนรันตอบกลับ
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

async function disableById(req,res) {
  const table = req.params.table || (req.path.split('/').filter(Boolean)[0]);
  const id = req.params.id;
  console.log('DISABLE ->', table,'id', id);

  try{
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