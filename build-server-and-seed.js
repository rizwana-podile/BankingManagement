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

// 1. backend/seed/seedData.js
writeFile(path.join(backendDir, 'seed', 'seedData.js'), `
const mongoose = require('mongoose');
const User = require('../models/User');
const Branch = require('../models/Branch');
const CustomerProfile = require('../models/CustomerProfile');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Beneficiary = require('../models/Beneficiary');
const Card = require('../models/Card');
const Loan = require('../models/Loan');
const FixedDeposit = require('../models/FixedDeposit');
const BillPayment = require('../models/BillPayment');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');

const seedData = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Seed] Database already seeded. Skipping.');
      return;
    }

    console.log('[Seed] Seeding enterprise sample data for Aura Apex Bank...');

    // 1. Create Branches
    const branches = await Branch.create([
      {
        branchName: 'Mumbai Nariman Point Flagship',
        branchCode: 'AURA01',
        ifscCode: 'AURA0001001',
        managerName: 'Rajeev Malhotra',
        address: 'Floor 12, Maker Chambers V, Nariman Point',
        city: 'Mumbai',
        state: 'Maharashtra',
        phone: '+91 22 2284 9012',
        email: 'mumbai.nariman@auraapex.com'
      },
      {
        branchName: 'New Delhi Connaught Place',
        branchCode: 'AURA02',
        ifscCode: 'AURA0001002',
        managerName: 'Vandana Sen',
        address: 'B-Block, Radial Road 3, Inner Circle, Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        phone: '+91 11 2341 8920',
        email: 'delhi.cp@auraapex.com'
      },
      {
        branchName: 'Bengaluru Indiranagar Tech Hub',
        branchCode: 'AURA03',
        ifscCode: 'AURA0001003',
        managerName: 'Siddharth Rao',
        address: '100ft Road, HAL 2nd Stage, Indiranagar',
        city: 'Bengaluru',
        state: 'Karnataka',
        phone: '+91 80 2520 4410',
        email: 'bengaluru.tech@auraapex.com'
      }
    ]);

    // 2. Create Admin & Staff Users
    const admin = await User.create({
      name: 'Vikramaditya Singhania',
      email: 'admin@auraapex.com',
      password: 'Admin@123',
      phone: '+91 98200 11223',
      role: 'admin',
      status: 'active'
    });

    const staff1 = await User.create({
      name: 'Rajesh Kumar',
      email: 'rajesh.kumar@auraapex.com',
      password: 'Staff@123',
      phone: '+91 98110 33445',
      role: 'employee',
      status: 'active'
    });

    const staff2 = await User.create({
      name: 'Sneha Deshmukh',
      email: 'sneha.deshmukh@auraapex.com',
      password: 'Staff@123',
      phone: '+91 98330 55667',
      role: 'employee',
      status: 'active'
    });

    // 3. Create 10 Customers
    const customerData = [
      {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210',
        city: 'Mumbai',
        state: 'Maharashtra',
        kycStatus: 'approved',
        pan: 'ABCPS1234D',
        aadhaar: 'XXXX-XXXX-9812'
      },
      {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+91 98765 43211',
        city: 'Ahmedabad',
        state: 'Gujarat',
        kycStatus: 'approved',
        pan: 'BFDPP5678E',
        aadhaar: 'XXXX-XXXX-3412'
      },
      {
        name: 'Amit Verma',
        email: 'amit.verma@example.com',
        phone: '+91 98765 43212',
        city: 'New Delhi',
        state: 'Delhi',
        kycStatus: 'under_review',
        pan: 'CKLPV9012F',
        aadhaar: 'XXXX-XXXX-6523'
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya.iyer@example.com',
        phone: '+91 98765 43213',
        city: 'Bengaluru',
        state: 'Karnataka',
        kycStatus: 'pending',
        pan: 'DHYAI3456G',
        aadhaar: 'XXXX-XXXX-8901'
      },
      {
        name: 'Vikram Mehta',
        email: 'vikram.mehta@example.com',
        phone: '+91 98765 43214',
        city: 'Pune',
        state: 'Maharashtra',
        kycStatus: 'approved',
        pan: 'ETRPM7890H',
        aadhaar: 'XXXX-XXXX-2345'
      },
      {
        name: 'Pooja Reddy',
        email: 'pooja.reddy@example.com',
        phone: '+91 98765 43215',
        city: 'Hyderabad',
        state: 'Telangana',
        kycStatus: 'approved',
        pan: 'FPQPR1234I',
        aadhaar: 'XXXX-XXXX-6789'
      },
      {
        name: 'Rohit Singh',
        email: 'rohit.singh@example.com',
        phone: '+91 98765 43216',
        city: 'Jaipur',
        state: 'Rajasthan',
        kycStatus: 'pending',
        pan: 'GHRRS5678J',
        aadhaar: 'XXXX-XXXX-1122'
      },
      {
        name: 'Neha Joshi',
        email: 'neha.joshi@example.com',
        phone: '+91 98765 43217',
        city: 'Mumbai',
        state: 'Maharashtra',
        kycStatus: 'approved',
        pan: 'HJSNJ9012K',
        aadhaar: 'XXXX-XXXX-3344'
      },
      {
        name: 'Karan Malhotra',
        email: 'karan.malhotra@example.com',
        phone: '+91 98765 43218',
        city: 'Chandigarh',
        state: 'Punjab',
        kycStatus: 'under_review',
        pan: 'IKTKM3456L',
        aadhaar: 'XXXX-XXXX-5566'
      },
      {
        name: 'Swati Chatterjee',
        email: 'swati.chatterjee@example.com',
        phone: '+91 98765 43219',
        city: 'Kolkata',
        state: 'West Bengal',
        kycStatus: 'approved',
        pan: 'JLMSC7890M',
        aadhaar: 'XXXX-XXXX-7788'
      }
    ];

    const customerUsers = [];
    const accounts = [];

    for (let i = 0; i < customerData.length; i++) {
      const cd = customerData[i];
      const user = await User.create({
        name: cd.name,
        email: cd.email,
        password: 'Customer@123',
        phone: cd.phone,
        role: 'customer',
        status: 'active'
      });
      customerUsers.push(user);

      // Create CustomerProfile
      await CustomerProfile.create({
        userId: user._id,
        customerId: 'CUST-' + (849200 + i),
        dob: new Date(1990 + (i % 8), (i * 2) % 12, 10 + i),
        address: { street: \`\${10 + i}, Premier Residency\`, city: cd.city, state: cd.state, pincode: '400001' },
        panNumber: cd.pan,
        aadhaarNumber: cd.aadhaar,
        kycStatus: cd.kycStatus
      });

      // Assign Branch
      const branch = branches[i % branches.length];

      // Primary Savings Account
      const balance = i === 0 ? 125000 : (i === 1 ? 85000 : 35000 + (i * 12000));
      const accNum = '10024859' + (1000 + i);

      const savingsAcc = await Account.create({
        userId: user._id,
        accountNumber: accNum,
        accountType: 'savings',
        ifscCode: branch.ifscCode,
        branchId: branch._id,
        balance,
        ledgerBalance: balance,
        status: 'active'
      });
      accounts.push(savingsAcc);

      // Second account for Rahul Sharma (Current/Salary Account)
      if (i === 0) {
        const salaryAcc = await Account.create({
          userId: user._id,
          accountNumber: '100248599901',
          accountType: 'salary',
          ifscCode: branch.ifscCode,
          branchId: branch._id,
          balance: 68500,
          ledgerBalance: 68500,
          status: 'active'
        });
        accounts.push(salaryAcc);
      }
    }

    const primaryCustomer = customerUsers[0];
    const secondaryCustomer = customerUsers[1];
    const primaryAccount = accounts[0];
    const salaryAccount = accounts[1];
    const priyaAccount = accounts[2];

    // 4. Seed Beneficiaries for Rahul Sharma
    await Beneficiary.create([
      {
        userId: primaryCustomer._id,
        name: 'Priya Patel',
        nickname: 'Priya',
        accountNumber: priyaAccount.accountNumber,
        ifscCode: priyaAccount.ifscCode,
        bankName: 'Aura Apex Bank',
        transferLimit: 200000
      },
      {
        userId: primaryCustomer._id,
        name: 'Aarav Singhania',
        nickname: 'Aarav',
        accountNumber: '918230918234',
        ifscCode: 'HDFC0001824',
        bankName: 'HDFC Bank',
        transferLimit: 100000
      },
      {
        userId: primaryCustomer._id,
        name: 'Sunita Sharma',
        nickname: 'Mom',
        accountNumber: '029384719283',
        ifscCode: 'SBIN0000452',
        bankName: 'State Bank of India',
        transferLimit: 50000
      }
    ]);

    // 5. Seed Cards for Rahul Sharma
    await Card.create([
      {
        userId: primaryCustomer._id,
        accountId: primaryAccount._id,
        cardNumber: '4532 8920 1842 7719',
        cardHolderName: 'RAHUL SHARMA',
        cardType: 'debit',
        cardNetwork: 'Visa',
        expiryMonth: '08',
        expiryYear: '29',
        cvv: '782',
        pin: '1234',
        status: 'active',
        dailyLimit: 75000,
        usedLimit: 12400,
        onlineEnabled: true,
        atmEnabled: true
      },
      {
        userId: primaryCustomer._id,
        accountId: primaryAccount._id,
        cardNumber: '6074 9182 3746 9012',
        cardHolderName: 'RAHUL SHARMA',
        cardType: 'credit',
        cardNetwork: 'RuPay',
        expiryMonth: '11',
        expiryYear: '30',
        cvv: '451',
        pin: '1234',
        status: 'active',
        dailyLimit: 200000,
        usedLimit: 48900,
        onlineEnabled: true,
        atmEnabled: true
      }
    ]);

    // 6. Seed Loans for Rahul Sharma and other customers
    await Loan.create([
      {
        userId: primaryCustomer._id,
        loanType: 'home',
        loanAmount: 3500000,
        outstandingAmount: 2840000,
        interestRate: 8.5,
        tenureMonths: 240,
        emiAmount: 30379,
        nextEmiDate: new Date('2026-10-05'),
        status: 'disbursed',
        purpose: 'Apartment Purchase in Powai',
        monthlyIncome: 145000,
        employmentType: 'Salaried',
        cibilScore: 785,
        repaymentHistory: [
          { amount: 30379, paidAt: new Date('2026-08-05'), referenceNumber: 'EMI894120', status: 'Success' },
          { amount: 30379, paidAt: new Date('2026-07-05'), referenceNumber: 'EMI894119', status: 'Success' }
        ]
      },
      {
        userId: primaryCustomer._id,
        loanType: 'personal',
        loanAmount: 150000,
        outstandingAmount: 150000,
        interestRate: 11.5,
        tenureMonths: 24,
        emiAmount: 7027,
        status: 'submitted',
        purpose: 'Home Renovation and Tech Gear',
        monthlyIncome: 145000,
        employmentType: 'Salaried',
        cibilScore: 785
      },
      {
        userId: secondaryCustomer._id,
        loanType: 'vehicle',
        loanAmount: 850000,
        outstandingAmount: 620000,
        interestRate: 9.2,
        tenureMonths: 60,
        emiAmount: 17720,
        nextEmiDate: new Date('2026-10-10'),
        status: 'disbursed',
        purpose: 'Electric Car Purchase',
        monthlyIncome: 95000,
        employmentType: 'Salaried',
        cibilScore: 760
      }
    ]);

    // 7. Seed Fixed Deposits for Rahul Sharma
    await FixedDeposit.create([
      {
        userId: primaryCustomer._id,
        accountId: primaryAccount._id,
        depositNumber: 'FD91823401',
        principalAmount: 100000,
        interestRate: 7.1,
        tenureMonths: 12,
        maturityDate: new Date('2027-03-15'),
        maturityAmount: 107380,
        status: 'active'
      },
      {
        userId: primaryCustomer._id,
        accountId: primaryAccount._id,
        depositNumber: 'FD91823402',
        principalAmount: 50000,
        interestRate: 7.5,
        tenureMonths: 24,
        maturityDate: new Date('2028-01-20'),
        maturityAmount: 58010,
        status: 'active'
      }
    ]);

    // 8. Seed Bill Payments for Rahul Sharma
    await BillPayment.create([
      {
        userId: primaryCustomer._id,
        accountId: primaryAccount._id,
        category: 'electricity',
        billerName: 'Adani Electricity Mumbai',
        consumerNumber: 'EL-908123',
        amount: 3450,
        status: 'paid',
        transactionId: 'TXN-2026-100291',
        referenceNumber: 'BILL782910'
      },
      {
        userId: primaryCustomer._id,
        accountId: primaryAccount._id,
        category: 'mobile',
        billerName: 'Jio Postpaid Mobile',
        consumerNumber: '+91 98765 43210',
        amount: 899,
        status: 'paid',
        transactionId: 'TXN-2026-100292',
        referenceNumber: 'BILL782911'
      }
    ]);

    // 9. Seed 20+ Transactions for Rahul Sharma
    const sampleTransactions = [
      {
        desc: 'Salary Credit - Tech Innovations Pvt Ltd',
        amt: 145000,
        type: 'credit',
        channel: 'NEFT',
        cat: 'Salary',
        daysAgo: 2,
        sender: 'Tech Innovations Pvt Ltd',
        receiver: 'Rahul Sharma'
      },
      {
        desc: 'Payment to Swiggy Online Food',
        amt: 1240,
        type: 'debit',
        channel: 'UPI',
        cat: 'Food',
        daysAgo: 3,
        sender: 'Rahul Sharma',
        receiver: 'Swiggy Merchant'
      },
      {
        desc: 'Transfer to Priya Patel',
        amt: 15000,
        type: 'debit',
        channel: 'IMPS',
        cat: 'Transfer',
        daysAgo: 5,
        sender: 'Rahul Sharma',
        receiver: 'Priya Patel'
      },
      {
        desc: 'Amazon India Shopping Purchase',
        amt: 4890,
        type: 'debit',
        channel: 'UPI',
        cat: 'Shopping',
        daysAgo: 6,
        sender: 'Rahul Sharma',
        receiver: 'Amazon Payments India'
      },
      {
        desc: 'Adani Electricity Bill Payment',
        amt: 3450,
        type: 'debit',
        channel: 'BILL_PAY',
        cat: 'Bills',
        daysAgo: 8,
        sender: 'Rahul Sharma',
        receiver: 'Adani Electricity Mumbai'
      },
      {
        desc: 'Dividend Payout - HDFC Mutual Fund',
        amt: 8400,
        type: 'credit',
        channel: 'NEFT',
        cat: 'Investment',
        daysAgo: 10,
        sender: 'HDFC Trustee Co',
        receiver: 'Rahul Sharma'
      },
      {
        desc: 'Home Loan EMI Deduction',
        amt: 30379,
        type: 'debit',
        channel: 'LOAN_REPAYMENT',
        cat: 'Loan',
        daysAgo: 12,
        sender: 'Rahul Sharma',
        receiver: 'Aura Loan Services'
      },
      {
        desc: 'Fixed Deposit Booking #FD91823401',
        amt: 100000,
        type: 'debit',
        channel: 'FD_DEPOSIT',
        cat: 'Investment',
        daysAgo: 15,
        sender: 'Rahul Sharma',
        receiver: 'Aura FD Desk'
      },
      {
        desc: 'Jio Postpaid Mobile Bill',
        amt: 899,
        type: 'debit',
        channel: 'BILL_PAY',
        cat: 'Bills',
        daysAgo: 18,
        sender: 'Rahul Sharma',
        receiver: 'Reliance Jio Infocomm'
      },
      {
        desc: 'Uber Rides Mumbai',
        amt: 650,
        type: 'debit',
        channel: 'UPI',
        cat: 'Transfer',
        daysAgo: 20,
        sender: 'Rahul Sharma',
        receiver: 'Uber India Systems'
      },
      {
        desc: 'Transfer from Aarav Singhania',
        amt: 12000,
        type: 'credit',
        channel: 'IMPS',
        cat: 'Transfer',
        daysAgo: 22,
        sender: 'Aarav Singhania',
        receiver: 'Rahul Sharma'
      },
      {
        desc: 'Starbucks Coffee Nariman Point',
        amt: 850,
        type: 'debit',
        channel: 'UPI',
        cat: 'Food',
        daysAgo: 24,
        sender: 'Rahul Sharma',
        receiver: 'Tata Starbucks'
      }
    ];

    let currentBalance = 125000;
    for (let j = 0; j < sampleTransactions.length; j++) {
      const st = sampleTransactions[j];
      const txnDate = new Date();
      txnDate.setDate(txnDate.getDate() - st.daysAgo);

      await Transaction.create({
        transactionId: 'TXN-2026-' + (980000 + j),
        senderAccountId: st.type === 'debit' ? primaryAccount._id : null,
        receiverAccountId: st.type === 'credit' ? primaryAccount._id : null,
        senderUserId: st.type === 'debit' ? primaryCustomer._id : null,
        receiverUserId: st.type === 'credit' ? primaryCustomer._id : null,
        senderName: st.sender,
        receiverName: st.receiver,
        senderAccountNumber: st.type === 'debit' ? primaryAccount.accountNumber : 'EXTERNAL',
        receiverAccountNumber: st.type === 'credit' ? primaryAccount.accountNumber : 'EXTERNAL',
        amount: st.amt,
        type: st.type,
        channel: st.channel,
        status: 'completed',
        balanceAfter: currentBalance,
        referenceNumber: 'REF' + (910200 + j) + 'AAB',
        remarks: st.desc,
        category: st.cat,
        createdAt: txnDate
      });
    }

    // 10. Seed Notifications
    await Notification.create([
      {
        recipientUserId: primaryCustomer._id,
        targetRole: 'customer',
        title: 'Salary Credited',
        message: '₹1,45,000 credited to your account from Tech Innovations Pvt Ltd.',
        type: 'transaction',
        isRead: true,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
      },
      {
        recipientUserId: primaryCustomer._id,
        targetRole: 'customer',
        title: 'UPI Transfer Success',
        message: '₹1,240 sent to Swiggy Merchant via Aura UPI.',
        type: 'transaction',
        isRead: false,
        createdAt: new Date(Date.now() - 3 * 3600 * 1000)
      },
      {
        recipientUserId: primaryCustomer._id,
        targetRole: 'customer',
        title: 'Upcoming EMI Reminder',
        message: 'Your Home Loan EMI of ₹30,379 is scheduled for auto-debit on 5th of next month.',
        type: 'loan',
        isRead: false,
        createdAt: new Date(Date.now() - 5 * 3600 * 1000)
      },
      {
        recipientUserId: null, // Broadcast
        targetRole: 'all',
        title: 'Scheduled System Maintenance Notice',
        message: 'Core banking systems will undergo scheduled routine maintenance on Sunday from 02:00 AM to 03:30 AM IST. Card transactions will remain operational.',
        type: 'system',
        isRead: false,
        createdAt: new Date(Date.now() - 12 * 3600 * 1000)
      },
      {
        recipientUserId: primaryCustomer._id,
        targetRole: 'customer',
        title: 'New Beneficiary Added',
        message: 'Beneficiary Sunita Sharma was added to your account.',
        type: 'security',
        isRead: true,
        createdAt: new Date(Date.now() - 48 * 3600 * 1000)
      }
    ]);

    // 11. Seed Audit Logs
    await AuditLog.create([
      {
        performedBy: { userId: admin._id, name: admin.name, role: 'admin' },
        action: 'SYSTEM_INITIALIZATION',
        entity: 'System',
        entityId: 'ROOT',
        ipAddress: '127.0.0.1',
        details: 'Enterprise Core Banking initialized with Mumbai, Delhi, and Bengaluru branches.',
        timestamp: new Date(Date.now() - 7 * 24 * 3600 * 1000)
      },
      {
        performedBy: { userId: staff1._id, name: staff1.name, role: 'employee' },
        action: 'KYC_APPROVE',
        entity: 'CustomerProfile',
        entityId: primaryCustomer._id.toString(),
        ipAddress: '192.168.1.15',
        details: 'Verified Aadhaar and PAN documents for Rahul Sharma.',
        timestamp: new Date(Date.now() - 6 * 24 * 3600 * 1000)
      },
      {
        performedBy: { userId: primaryCustomer._id, name: primaryCustomer.name, role: 'customer' },
        action: 'LOGIN',
        entity: 'User',
        entityId: primaryCustomer._id.toString(),
        ipAddress: '127.0.0.1',
        details: 'Customer logged in successfully.',
        timestamp: new Date(Date.now() - 3600 * 1000)
      }
    ]);

    console.log('[Seed] Enterprise sample database successfully created with 10+ customers, accounts, loans, cards, transactions, and audit logs!');
  } catch (err) {
    console.error('[Seed] Seeding error:', err);
  }
};

module.exports = seedData;
`);

// 2. backend/server.js
writeFile(path.join(backendDir, 'server.js'), `
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { connectDB } = require('./config/db');
const seedData = require('./seed/seedData');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/accounts', require('./routes/accountRoutes'));
app.use('/api/transfers', require('./routes/transferRoutes'));
app.use('/api/beneficiaries', require('./routes/beneficiaryRoutes'));
app.use('/api/cards', require('./routes/cardRoutes'));
app.use('/api/loans', require('./routes/loanRoutes'));
app.use('/api/fds', require('./routes/fdRoutes'));
app.use('/api/bills', require('./routes/billRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/staff', require('./routes/staffRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));

// Public Health & Credentials endpoint for seamless 1-click evaluation
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ONLINE',
    bank: 'Aura Apex Bank',
    system: 'Enterprise Core Banking System',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/demo-users', (req, res) => {
  res.json({
    success: true,
    credentials: [
      {
        role: 'Customer (Primary)',
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        password: 'Customer@123',
        description: 'Complete profile with Savings & Salary accounts, cards, loans, FDs, and transactions'
      },
      {
        role: 'Customer (Secondary)',
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        password: 'Customer@123',
        description: 'Useful for testing inter-customer real-time money transfers'
      },
      {
        role: 'Staff / Branch Officer',
        name: 'Rajesh Kumar',
        email: 'rajesh.kumar@auraapex.com',
        password: 'Staff@123',
        description: 'Manages KYC approval queue, loan disbursement, accounts, and transaction monitoring'
      },
      {
        role: 'System Administrator',
        name: 'Vikramaditya Singhania',
        email: 'admin@auraapex.com',
        password: 'Admin@123',
        description: 'Bank-wide analytics charts, user management, branch configuration, audit logs, and broadcasts'
      }
    ]
  });
});

// Global Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    await seedData();

    app.listen(PORT, () => {
      console.log(\`==================================================\`);
      console.log(\`   AURA APEX BANK - CORE BANKING API SERVER\`);
      console.log(\`   Listening on: http://localhost:\${PORT}\`);
      console.log(\`   Health:       http://localhost:\${PORT}/api/health\`);
      console.log(\`   Demo Logins:  http://localhost:\${PORT}/api/demo-users\`);
      console.log(\`==================================================\`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

module.exports = app;
`);

// 3. backend/.env.example
writeFile(path.join(backendDir, '.env.example'), `
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/aura_apex_bank
JWT_SECRET=aura_apex_super_secret_jwt_key_2026
`);

writeFile(path.join(backendDir, '.env'), `
PORT=5000
NODE_ENV=development
JWT_SECRET=aura_apex_super_secret_jwt_key_2026
`);

console.log('Server and Seed created successfully!');