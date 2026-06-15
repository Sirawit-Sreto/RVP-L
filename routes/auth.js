const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db'); 


router.post('/register', async (req, res) => {
  const { role_id, user_firstname, user_lastname, user_department, user_pic, password } = req.body;

  if (!user_firstname || !user_lastname || !password) {
    return res.status(400).json({ error: 'Firstname, lastname, and password are required.' });
  }

  try {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const queryText = `
      INSERT INTO users (role_id, user_firstname, user_lastname, user_department, user_pic, password_hash)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING user_id, role_id, user_firstname, user_lastname, user_department, user_pic;
    `;
    const values = [role_id || null, user_firstname, user_lastname, user_department || null, user_pic || null, passwordHash];

    const result = await db.query(queryText, values);
    res.status(201).json({ message: 'User registered successfully', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  const { user_id, password } = req.body;

  if (!user_id || !password) {
    return res.status(400).json({ error: 'user_id and password are required.' });
  }

  try {
    const queryText = 'SELECT * FROM users WHERE user_id = $1 AND is_deleted = false';
    const result = await db.query(queryText, [user_id]);


    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid user_id or password.' });
    }

    const user = result.rows[0];

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(400).json({ error: 'Invalid user_id or password.' });
    }

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
        role_id: user.role_id,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        user_department: user.user_department,
        user_pic: user.user_pic     
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;