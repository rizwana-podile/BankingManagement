const mongoose = require('mongoose');

const customerProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  customerId: {
    type: String,
    required: true,
    unique: true
  },
  dob: {
    type: Date
  },
  address: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  panNumber: {
    type: String,
    trim: true
  },
  aadhaarNumber: {
    type: String,
    trim: true
  },
  kycStatus: {
    type: String,
    enum: ['pending', 'under_review', 'approved', 'rejected'],
    default: 'pending'
  },
  kycDocuments: {
    idProof: { type: String, default: 'Aadhaar_Card_Verified.pdf' },
    addressProof: { type: String, default: 'Electricity_Bill_Latest.pdf' },
    panCard: { type: String, default: 'PAN_Card_Scanned.pdf' },
    photo: { type: String, default: 'Customer_Passport_Photo.jpg' }
  },
  reviewerNotes: {
    type: String,
    default: ''
  },
  reviewedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: {
    type: Date
  },
  communicationPreferences: {
    email: { type: Boolean, default: true },
    sms: { type: Boolean, default: true },
    push: { type: Boolean, default: true }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('CustomerProfile', customerProfileSchema);
