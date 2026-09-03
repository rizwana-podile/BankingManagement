const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
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
  cardNumber: {
    type: String,
    required: true,
    unique: true
  },
  cardHolderName: {
    type: String,
    required: true
  },
  cardType: {
    type: String,
    enum: ['debit', 'credit'],
    default: 'debit'
  },
  cardNetwork: {
    type: String,
    enum: ['Visa', 'Mastercard', 'RuPay'],
    default: 'RuPay'
  },
  expiryMonth: {
    type: String,
    default: '08'
  },
  expiryYear: {
    type: String,
    default: '31'
  },
  cvv: {
    type: String,
    default: '782'
  },
  pin: {
    type: String,
    default: '1234'
  },
  status: {
    type: String,
    enum: ['active', 'blocked', 'inactive'],
    default: 'active'
  },
  dailyLimit: {
    type: Number,
    default: 50000
  },
  usedLimit: {
    type: Number,
    default: 0
  },
  onlineEnabled: {
    type: Boolean,
    default: true
  },
  atmEnabled: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Card', cardSchema);
