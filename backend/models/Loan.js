const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  loanType: {
    type: String,
    enum: ['personal', 'home', 'education', 'vehicle'],
    required: true
  },
  loanAmount: {
    type: Number,
    required: true
  },
  outstandingAmount: {
    type: Number,
    required: true
  },
  interestRate: {
    type: Number,
    required: true,
    default: 9.5
  },
  tenureMonths: {
    type: Number,
    required: true
  },
  emiAmount: {
    type: Number,
    required: true
  },
  nextEmiDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['submitted', 'under_review', 'approved', 'rejected', 'disbursed'],
    default: 'submitted'
  },
  purpose: {
    type: String,
    default: 'Personal Financial Planning'
  },
  monthlyIncome: {
    type: Number,
    default: 85000
  },
  employmentType: {
    type: String,
    enum: ['Salaried', 'Self-Employed', 'Business', 'Professional'],
    default: 'Salaried'
  },
  cibilScore: {
    type: Number,
    default: 765
  },
  approvedAmount: {
    type: Number
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  remarks: {
    type: String,
    default: ''
  },
  repaymentHistory: [{
    amount: Number,
    paidAt: { type: Date, default: Date.now },
    referenceNumber: String,
    status: { type: String, default: 'Success' }
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Loan', loanSchema);
