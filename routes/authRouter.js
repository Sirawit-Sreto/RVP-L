const express = require('express');
const router = express.Router();
const db = require('../db');

// POST /api/auth/login
// body: { employee_id, password }
// password validation: ตรวจแค่ว่ายาว >= 6 (ยังไม่มี bcrypt — เพิ่มได้ทีหลัง)
router.post('/login', async (req, res) => {
  const { employee_id, password } = req.body;

  if (!employee_id || !password)
    return res.status(400).json({ error: 'กรุณากรอก employee_id และ password' });

  if (password.length < 6)
    return res.status(400).json({ error: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });

  try {
    const { rows } = await db.query(
      `SELECT u.*, r.role_name
       FROM users u
       LEFT JOIN roles r ON u.role_id = r.role_id
       WHERE u.employee_id = $1 AND u.is_deleted = false`,
      [employee_id.trim()]
    );

    if (rows.length === 0)
      return res.status(401).json({ error: 'ไม่พบรหัสพนักงานในระบบ' });

    const u = rows[0];
    res.json({
      userId:     u.user_id,
      employeeId: u.employee_id,
      name:       `คุณ${u.user_firstname} ${u.user_lastname}`,
      email:      u.email,
      position:   u.position,
      dept:       u.user_department,
      role:       u.role_name,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
