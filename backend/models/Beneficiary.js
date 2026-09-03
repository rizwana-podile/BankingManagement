const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  nickname: {
    type: String,
    trim: true
  },
  accountNumber: {
    type: String,
    required: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    trim: true
  },
  bankName: {
    type: String,
    default: 'Aura Apex Bank'
  },
  transferLimit: {
    type: Number,
    default: 100000
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
