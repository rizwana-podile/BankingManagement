const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

// 1. backend/middleware/auth.js
writeFile(path.join(backendDir, 'middleware', 'auth.js'), `
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'aura_apex_super_secret_jwt_key_2026');
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'User belonging to token no longer exists' });
    }
    if (req.user.status === 'locked' || req.user.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Your account is locked or disabled. Please contact bank staff.' });
    }
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Not authorized, token invalid or expired' });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: \`Access forbidden. Role '\${req.user ? req.user.role : 'guest'}' is not authorized for this resource.\`
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
`);

// 2. backend/middleware/auditLogger.js
writeFile(path.join(backendDir, 'middleware', 'auditLogger.js'), `
const AuditLog = require('../models/AuditLog');

const logAudit = async (req, action, entity, entityId, details) => {
  try {
    const performedBy = req && req.user ? {
      userId: req.user._id,
      name: req.user.name,
      role: req.user.role
    } : {
      name: 'System',
      role: 'system'
    };

    const ipAddress = req ? (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1') : '127.0.0.1';

    await AuditLog.create({
      performedBy,
      action,
      entity,
      entityId: entityId ? String(entityId) : '',
      ipAddress,
      details,
      timestamp: new Date()
    });
  } catch (err) {
    console.error('[AuditLog] Error recording audit:', err.message);
  }
};

module.exports = { logAudit };
`);

// 3. backend/middleware/errorHandler.js
writeFile(path.join(backendDir, 'middleware', 'errorHandler.js'), `
const errorHandler = (err, req, res, next) => {
  console.error('[GlobalError]', err.stack || err.message);

  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message || 'Internal Server Error';

  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Resource not found with specified ID';
  } else if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue)[0];
    message = \`Duplicate field value entered for '\${field}'. Please choose another.\`;
  } else if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors).map(val => val.message).join(', ');
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack
  });
};

module.exports = errorHandler;
`);

console.log('Middleware created!');