const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  performedBy: {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, default: 'System' },
    role: { type: String, default: 'system' }
  },
  action: {
    type: String,
    required: true
  },
  entity: {
    type: String,
    default: 'General'
  },
  entityId: {
    type: String,
    default: ''
  },
  ipAddress: {
    type: String,
    default: '127.0.0.1'
  },
  details: {
    type: String,
    default: ''
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('AuditLog', auditLogSchema);
