const mongoose = require('mongoose');

const fixedDepositSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  accountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account',
    required: true
  },
  depositNumber: {
    type: String,
    required: true,
    unique: true
  },
  principalAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true,
    default: 7.1
  },
  tenureMonths: {
    type: Number,
    required: true
  },
  maturityDate: {
    type: Date,
    required: true
  },
  maturityAmount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'matured', 'closed_prematurely'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FixedDeposit', fixedDepositSchema);
