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
