const express = require('express');
const genericRouter = require('./genericRouter');
const projectRouter = require('./projectRouter');
const authRouter    = require('./authRouter');

const router = express.Router();

// Specific routes (ต้องอยู่ก่อน generic)
router.use('/auth',     authRouter);
router.use('/projects', projectRouter);

// Generic CRUD สำหรับ tables อื่น
router.use('/:table', genericRouter);

module.exports = router;
