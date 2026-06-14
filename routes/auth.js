// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); // เชื่อมต่อ db.js เดิมของคุณ

// 1. REGISTER (สมัครสมาชิก + แฮชรหัสผ่านเก็บเข้าตาราง users)
router.post('/register', async (req, res) => {
  const { role_id, user_firstname, user_lastname, user_department, user_pic, password } = req.body;

  if (!user_firstname || !user_lastname || !password) {
    return res.status(400).json({ error: 'Firstname, lastname, and password are required.' });
  }

  try {
    // แฮชรหัสผ่านด้วย bcrypt เพิ่มความปลอดภัยให้กับคอลัมน์ password_hash
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const queryText = `
      INSERT INTO users (role_id, user_firstname, user_lastname, user_department, user_pic, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, user_firstname, user_lastname, role_id;
    `;
    const values = [role_id || null, user_firstname, user_lastname, user_department || null, user_pic || null, passwordHash];

    const result = await db.query(queryText, values);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 2. LOGIN (ตรวจสอบรหัสผ่าน + จ่าย JWT Token)
router.post('/login', async (req, res) => {
  const { user_firstname, user_lastname, password } = req.body;

  if (!user_firstname || !user_lastname || !password) {
    return res.status(400).json({ error: 'Firstname, lastname, and password are required.' });
  }

  try {
    // ค้นหาผู้ใช้จากชื่อและนามสกุลที่ระบุ และบัญชีต้องยังไม่ถูกลบ
    const queryText = 'SELECT * FROM users WHERE user_firstname = $1 AND user_lastname = $2 AND is_deleted = false';
    const result = await db.query(queryText, [user_firstname, user_lastname]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid firstname, lastname, or password.' });
    }

    const user = result.rows[0];

    // ถอดรหัสเปรียบเทียบรหัสผ่าน
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid firstname, lastname, or password.' });
    }

    // สร้าง Token โดยผูก user_id และ role_id ไว้ด้านใน (มีอายุ 24 ชั่วโมง)
    const token = jwt.sign(
      { user_id: user.user_id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token: token,
      user: {
        user_id: user.user_id,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        role_id: user.role_id
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;