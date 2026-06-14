const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  // 1. ดึง Token จาก Header ตามปกติ (สำหรับ Postman / Frontend จริง)
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];

  // 2. 💡 ทางลัดสำหรับ Web Browser: ถ้าใน Header ไม่มี ให้แอบไปเช็กใน Query String บน URL (?token=...)
  if (!token && req.query.token) {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Access denied. Token is missing.' });
  }

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next(); 
  } catch (error) {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
};

module.exports = authenticateToken;