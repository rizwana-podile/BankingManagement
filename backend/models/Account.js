const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountNumber: {
    type: String,
    required: true,
    unique: true
  },
  accountType: {
    type: String,
    enum: ['savings', 'current', 'salary'],
    required: true,
    default: 'savings'
  },
  ifscCode: {
    type: String,
    required: true
  },
  branchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Branch'
  },
  balance: {
    type: Number,
    required: true,
    default: 10000,
    min: 0
  },
  ledgerBalance: {
    type: Number,
    required: true,
    default: 10000
  },
  status: {
    type: String,
    enum: ['active', 'frozen', 'dormant', 'closed'],
    default: 'active'
  },
  openingDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Account', accountSchema);
