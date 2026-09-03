const mongoose = require('mongoose');

const billPaymentSchema = new mongoose.Schema({
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
  category: {
    type: String,
    enum: ['electricity', 'water', 'mobile', 'internet', 'dth', 'insurance', 'credit_card'],
    required: true
  },
  billerName: {
    type: String,
    required: true
  },
  consumerNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['paid', 'pending', 'failed'],
    default: 'paid'
  },
  transactionId: {
    type: String
  },
  referenceNumber: {
    type: String
  },
  paidAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('BillPayment', billPaymentSchema);
