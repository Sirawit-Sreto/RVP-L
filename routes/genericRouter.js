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

function isAllowed(table) {
  return Object.prototype.hasOwnProperty.call(tablePK, table);
}

// 1. GET /api/:table -> ดึงข้อมูลทั้งหมดในตารางนั้นๆ
router.get('/', async (req, res) => {
  const table = req.params.table;
  if (!isAllowed(table)) return res.status(404).json({ error: 'Unknown table' });
  try {
    let queryText = `SELECT * FROM ${table}`;
    if (table === 'projects' || table === 'users') {
      queryText += ` WHERE is_deleted = false`;
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
  if (!isAllowed(table)) return res.status(404).json({ error: 'Unknown table' });
  const pk = tablePK[table];
  try {
    let queryText = `SELECT * FROM ${table} WHERE ${pk} = $1`;
    
    if (table === 'projects' || table === 'users') {
      queryText += ` AND is_deleted = false`;
    }
    
    queryText += ` LIMIT 1`;
    
    const { rows } = await db.query(queryText, [id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: `The ${table} you are looking for was not found` });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. DELETE /api/:table/:id -> ลบข้อมูล
router.delete('/:id', async (req, res) => { 
  const table = req.params.table;
  const id = req.params.id;
  
  if (!isAllowed(table)) return res.status(404).json({ error: 'Unknown table' }); 

  if (table === 'users') {
    return res.status(403).json({ error: 'Deleting users is currently disabled' });
  }

  const pk = tablePK[table];
  try {
    let rows;
    if (table === 'projects') {
      const result = await db.query(
        `UPDATE projects SET is_deleted = true WHERE project_id = $1 AND is_deleted = false RETURNING *`,
        [id]
      );
      rows = result.rows;
    } else {
      const result = await db.query(
        `DELETE FROM ${table} WHERE ${pk} = $1 RETURNING *`,
        [id]
      );
      rows = result.rows;
    }
    
    if (rows.length === 0) {
      return res.status(404).json({ error: `The item you want to delete from ${table} was not found` });
    }
    
    res.json({ 
      success: true,
      message: table === 'projects' 
        ? 'The project was soft-deleted successfully' 
        : `The item from ${table} was deleted permanently`, 
      deletedItem: rows[0] 
    });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;