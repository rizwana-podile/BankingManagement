const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true
  },
  senderAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  receiverAccountId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Account'
  },
  senderUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  receiverUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  senderName: {
    type: String,
    default: 'Aura Apex Bank'
  },
  receiverName: {
    type: String,
    default: 'Aura Apex Bank'
  },
  senderAccountNumber: {
    type: String
  },
  receiverAccountNumber: {
    type: String
  },
  senderIfsc: {
    type: String
  },
  receiverIfsc: {
    type: String
  },
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: String,
    enum: ['credit', 'debit'],
    required: true
  },
  channel: {
    type: String,
    enum: ['IMPS', 'NEFT', 'RTGS', 'UPI', 'INTERNAL', 'BILL_PAY', 'LOAN_DISBURSEMENT', 'LOAN_REPAYMENT', 'FD_DEPOSIT', 'FD_MATURITY'],
    default: 'IMPS'
  },
  status: {
    type: String,
    enum: ['completed', 'pending', 'failed'],
    default: 'completed'
  },
  balanceAfter: {
    type: Number,
    required: true
  },
  referenceNumber: {
    type: String,
    required: true
  },
  remarks: {
    type: String,
    default: 'Fund Transfer'
  },
  category: {
    type: String,
    enum: ['Transfer', 'Bills', 'Shopping', 'Investment', 'Food', 'Salary', 'Loan', 'Other'],
    default: 'Transfer'
  },
  isSuspicious: {
    type: Boolean,
    default: false
  },
  flaggedReason: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Transaction', transactionSchema);
