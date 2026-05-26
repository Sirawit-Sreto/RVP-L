const express = require('express');
const genericRouter = require('./genericRouter');

const router = express.Router();

router.use('/:table', genericRouter);

module.exports = router;
