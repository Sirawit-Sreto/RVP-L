const express = require('express');
const router = express.Router({ mergeParams: true });
const db = require('../db'); 

const tablePK = {
  task: 'task_id',
  outsource: 'user_out_id',
  users: 'user_id',
  roles: 'role_id',
  cr: 'cr_id',
  request: 'req_id',
  projects: 'project_id',
  status: 'status_id',
  tags: 'tag_id',
  category: 'category_id',
  types: 'type_id',
  department: 'department_id',
  position: 'position_id',
  config: 'config_id'
};

function isAllowed(table) { // ตรวจสอบว่า table ที่ร้องขอมีอยู่ใน tablePK หรือไม่
  return Object.prototype.hasOwnProperty.call(tablePK, table);
}


router.get('/health-check-status/:table', async (req, res) => { 
  const table = req.params.table;
  if (!isAllowed(table)) return res.status(404).json({ ready: false, error: `Table : ${table} you are looking for was not found` });

  try {
    await db.query('SELECT 1'); 
    res.status(200).json({ ready: true, message: `Database connection for ${table} is healthy` });
  } catch (err) {
    res.status(503).json({ ready: false, error: err.message });
  }
});


async function checkLoadBalancerMiddleware(req, res, next) {
  const table = req.params.table;

  if (req.path.startsWith('/health-check-status')) {
    return next();
  }
  try {
    const response = await fetch(`http://localhost:5000/api/${table}/health-check-status/${table}`);

    if (response.status === 200) { 
      console.log(`[SUCCESS] PostgreSQL is ready for table : ${table}`);
      next(); 
    } else {
      console.log(`[SERVER ERROR ${response.status} ]  Table "${table}" not found `);
      res.status(502).json({ error: `${response.status} Table ${table} Failed system health check` });
    }
  } catch (error) {
    console.log(`[NETWORK ERROR] Cannot connect to system check for ${table}`);
    res.status(503).json({ error: `Table ${table} Network Error: ${error.message}` });
  }
}
router.use(checkLoadBalancerMiddleware);


// 1. GET /api/:table -> ดึงข้อมูลทั้งหมดในตารางนั้นๆ
router.get('/', async (req, res) => {
  const table = req.params.table;
  try {
    let queryText = `SELECT * FROM ${table}`;
    if (table === 'projects' || table === 'users') {
      // queryText += ` WHERE is_deleted = false`; เอาไว้เผื่อตอนที่ไม่ต้องการให้โชว์คนที่โดนลบออกไปแล้ว
    }
    queryText += ` ORDER BY ${tablePK[table]} DESC LIMIT 100`;

    const { rows } = await db.query(queryText);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET /api/:table/:id -> ดึงข้อมูลทีละตัวด้วย ID
router.get('/:id', async (req, res) => {
  const table = req.params.table;
  const id = req.params.id;
  const pk = tablePK[table];
    try {
  let queryText = `SELECT * FROM ${table} WHERE ${pk} = $1`;
  const { rows } = await db.query(queryText, [id]);

  if (rows.length === 0) { // สำหรับที่ไม่มี id
    return res.status(404).json({ 
      error: `Table: ${table} you are looking for was not found` 
    });
  }
  const projectData = rows[0];

  if (projectData.is_deleted === true) {
    return res.status(410).json({ // สำหรับ is_deleted = true
      message: `ID ${id} exists, but it has been deleted from the table : ${table} `,
      data: projectData 
    });
  }

  return res.json(projectData); //สำหรับคนที่มี id และไม่ได้ถูกลบออก

} catch (err) {
  return res.status(500).json({ error: err.message }); // สำรหับ error เช่นพิมพ์คำสั่งผิดหากกด send ใน postman จะแสดงว่าผิดยังไง
}
});

// 3. DELETE /api/:table and users/:id -> ลบข้อมูล
router.delete('/:id', async (req, res) => { 
  const table = req.params.table;
  const id = req.params.id;
  const pk = tablePK[table];

  try {
    let result;

    if (table === 'projects' || table === 'users') {
      result = await db.query(
        `UPDATE ${table} SET is_deleted = true WHERE ${pk} = $1 AND is_deleted = false RETURNING *`,
        [id]
      );
    } else {
      result = await db.query(
        `DELETE FROM ${table} WHERE ${pk} = $1 RETURNING *`,
        [id]
      );
    }
    
    const rows = result.rows; 

    if (!rows || rows.length === 0) {
      return res.status(404).json({ 
        error: `The item with ID ${id} in table "${table}" was not found, or it was already deleted!` 
      });
    } 

    const deletedItem = rows[0];

    if (table === 'projects' || table === 'users') {
      return res.status(200).json({ 
        success: true,
        message: `The ${table} with ID ${id} was marked as deleted successfully`,
        deletedItem
      });
    }
    
    return res.json({ 
      success: true,
      message: `The ${table} with ID ${id} was deleted successfully`,
      deletedItem: deletedItem 
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;