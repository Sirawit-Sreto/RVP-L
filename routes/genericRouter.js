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
  const table = req.params.table || req.path.split('/').filter(Boolean)[0];
  console.log("checkTableAvailable ->", table);
  try {
      // เรียกใช้ฟังก์ชันผ่านตัวแปร genericService ที่คุณ require ไว้ด้านบน
      await genericService.check_table_available(table);
      
      // ฝากชื่อตารางที่ตรวจสอบแล้วไว้ใน req เผื่อ getAllTable เอาไปใช้ต่อ
      req.validatedTable = table;
      
      next(); // ตารางถูกต้อง ส่งไปทำงานต่อได้
    } catch (error) {
      // ถ้าหาตารางไม่เจอ ตัดจบและส่งสเตตัส 404 ทันที
      return res.status(error.status || 404).json({
        success: false,
        message: error.message
      });
}
};

// Route declarations 
router.get('/users/list', checkTableAvailable, getAllTable);
router.get('/outsource/list', checkTableAvailable, getAllTable);
router.get('/projects/list', checkTableAvailable, getAllTable);
router.get('/roles/list', checkTableAvailable, getAllTable);
router.get('/status/list', checkTableAvailable, getAllTable);
router.get('/cr/list', checkTableAvailable, getAllTable);
router.get('/request/list', checkTableAvailable, getAllTable);
router.get('/task/list', checkTableAvailable, getAllTable);
router.get('/config/list', checkTableAvailable, getAllTable);
// children of config
router.get('/department/list', checkTableAvailable, getAllTable);
router.get('/type/list', checkTableAvailable, getAllTable);
router.get('/category/list', checkTableAvailable, getAllTable);
router.get('/position/list', checkTableAvailable, getAllTable);
router.get('/tags/list', checkTableAvailable, getAllTable);


// get by ID
router.get('/users/:id', checkTableAvailable, getById);
router.get('/outsource/:id', checkTableAvailable, getById);
router.get('/projects/:id', checkTableAvailable, getById);
router.get('/roles/:id', checkTableAvailable, getById);
router.get('/status/:id', checkTableAvailable, getById);
router.get('/cr/:id', checkTableAvailable, getById);
router.get('/request/:id', checkTableAvailable, getById);
router.get('/task/:id', checkTableAvailable, getById);
router.get('/config/:id', checkTableAvailable, getById);
//children of config
router.get('/department/:id', checkTableAvailable, getById);
router.get('/type/:id', checkTableAvailable, getById);
router.get('/category/:id', checkTableAvailable, getById);
router.get('/position/:id', checkTableAvailable, getById);
router.get('/tags/:id', checkTableAvailable, getById);


// insert table by ID 
router.post('/users/update/:id',checkTableAvailable, createByTable);
router.post('/outsource/update/:id', checkTableAvailable, createByTable);
router.post('/projects/update/:id', checkTableAvailable, createByTable);
router.post('/roles/update/:id', checkTableAvailable, createByTable);
router.post('/status/update/:id', checkTableAvailable, createByTable);
router.post('/cr/update/:id', checkTableAvailable, createByTable);
router.post('/request/update/:id', checkTableAvailable, createByTable);
router.post('/task/update/:id', checkTableAvailable, createByTable);
router.post('/config/update/:id', checkTableAvailable, createByTable);
//children of config
router.post('/department/update/:id', checkTableAvailable, createByTable);
router.post('/type/update/:id', checkTableAvailable, createByTable);
router.post('/category/update/:id', checkTableAvailable, createByTable);
router.post('/position/update/:id', checkTableAvailable, createByTable);
router.post('/tags/update/:id', checkTableAvailable, createByTable);


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