const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const backendDir = path.join(rootDir, 'backend');

function writeFile(filePath, content) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, content.trim() + '\n', 'utf8');
  console.log(`Created: ${filePath}`);
}

// 1. backend/config/db.js
writeFile(path.join(backendDir, 'config', 'db.js'), `
const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      console.log('No MONGODB_URI specified. Initializing mongodb-memory-server...');
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log(\`[DB] InMemory MongoDB started: \${mongoUri}\`);
      } catch (memErr) {
        console.warn('[DB] Could not launch mongodb-memory-server directly:', memErr.message);
        mongoUri = 'mongodb://127.0.0.1:27017/aura_apex_bank';
      }
    }

    const conn = await mongoose.connect(mongoUri);
    console.log(\`[DB] MongoDB Connected: \${conn.connection.host} / \${conn.connection.name}\`);
    return conn;
  } catch (error) {
    console.error(\`[DB] Initial connection failed: \${error.message}\`);
    if (!mongod) {
      try {
        console.log('[DB] Attempting fallback to in-memory MongoDB...');
        const { MongoMemoryServer } = require('mongodb-memory-server');
        mongod = await MongoMemoryServer.create();
        const fallbackUri = mongod.getUri();
        const conn = await mongoose.connect(fallbackUri);
        console.log(\`[DB] Fallback InMemory MongoDB connected: \${fallbackUri}\`);
        return conn;
      } catch (fbErr) {
        console.error('[DB] Fallback failed:', fbErr.message);
        process.exit(1);
      }
    }
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('[DB] Disconnect error:', err);
  }
};

module.exports = { connectDB, disconnectDB };
`);

// 2. backend/models/User.js
writeFile(path.join(backendDir, 'models', 'User.js'), `
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['customer', 'employee', 'admin'],
    default: 'customer'
  },
  status: {
    type: String,
    enum: ['active', 'locked', 'disabled'],
    default: 'active'
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date
  },
  lastLogin: {
    type: Date
  },
  avatar: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
`);

// 3. backend/models/Branch.js
writeFile(path.join(backendDir, 'models', 'Branch.js'), `
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  branchName: {
    type: String,
    required: true,
    trim: true
  },
  branchCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  ifscCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  managerName: {
    type: String,
    default: 'Branch Manager'
  },
  address: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Branch', branchSchema);
`);

// 4. backend/models/CustomerProfile.js
writeFile(path.join(backendDir, 'models', 'CustomerProfile.js'), `
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
`);

// 5. backend/models/Account.js
writeFile(path.join(backendDir, 'models', 'Account.js'), `
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
`);

// 6. backend/models/Transaction.js
writeFile(path.join(backendDir, 'models', 'Transaction.js'), `
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
`);

// 7. backend/models/Beneficiary.js
writeFile(path.join(backendDir, 'models', 'Beneficiary.js'), `
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
`);

// 8. backend/models/Card.js
writeFile(path.join(backendDir, 'models', 'Card.js'), `
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
`);

// 9. backend/models/Loan.js
writeFile(path.join(backendDir, 'models', 'Loan.js'), `
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
`);

// 10. backend/models/FixedDeposit.js
writeFile(path.join(backendDir, 'models', 'FixedDeposit.js'), `
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
`);

// 11. backend/models/BillPayment.js
writeFile(path.join(backendDir, 'models', 'BillPayment.js'), `
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
`);

// 12. backend/models/Notification.js
writeFile(path.join(backendDir, 'models', 'Notification.js'), `
const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipientUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  targetRole: {
    type: String,
    enum: ['all', 'customer', 'employee', 'admin'],
    default: 'customer'
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['transaction', 'loan', 'kyc', 'security', 'system', 'deposit', 'card'],
    default: 'system'
  },
  isRead: {
    type: Boolean,
    default: false
  },
  link: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Notification', notificationSchema);
`);

// 13. backend/models/AuditLog.js
writeFile(path.join(backendDir, 'models', 'AuditLog.js'), `
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
`);

console.log('All 13 Mongoose models & DB config created!');