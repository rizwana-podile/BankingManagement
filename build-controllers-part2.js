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

// 6. backend/controllers/loanController.js
writeFile(path.join(backendDir, 'controllers', 'loanController.js'), `
const Loan = require('../models/Loan');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.getMyLoans = async (req, res, next) => {
  try {
    const loans = await Loan.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, loans });
  } catch (err) {
    next(err);
  }
};

exports.applyLoan = async (req, res, next) => {
  try {
    const { loanType, loanAmount, tenureMonths, monthlyIncome, employmentType, purpose } = req.body;

    const amount = Number(loanAmount);
    const tenure = Number(tenureMonths);

    if (!amount || amount < 10000 || !tenure || tenure < 6) {
      return res.status(400).json({ success: false, message: 'Invalid loan amount or tenure.' });
    }

    const rates = { personal: 11.5, home: 8.5, education: 9.0, vehicle: 9.5 };
    const interestRate = rates[loanType] || 10.0;

    // Monthly EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const monthlyRate = (interestRate / 12) / 100;
    const factor = Math.pow(1 + monthlyRate, tenure);
    const emiAmount = Math.round((amount * monthlyRate * factor) / (factor - 1));

    const nextMonth = new Date();
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    const loan = await Loan.create({
      userId: req.user._id,
      loanType: loanType || 'personal',
      loanAmount: amount,
      outstandingAmount: amount,
      interestRate,
      tenureMonths: tenure,
      emiAmount,
      nextEmiDate: nextMonth,
      status: 'submitted',
      purpose: purpose || 'General Financing',
      monthlyIncome: monthlyIncome || 75000,
      employmentType: employmentType || 'Salaried',
      cibilScore: Math.floor(720 + Math.random() * 80)
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Loan Application Submitted',
      message: \`Your application for \${loanType.toUpperCase()} Loan of ₹\${amount.toLocaleString('en-IN')} has been submitted for review.\`,
      type: 'loan'
    });

    await logAudit(req, 'APPLY_LOAN', 'Loan', loan._id, \`Applied for \${loanType} loan of ₹\${amount}\`);

    res.status(201).json({ success: true, message: 'Loan application submitted successfully!', loan });
  } catch (err) {
    next(err);
  }
};

exports.repayEmi = async (req, res, next) => {
  try {
    const { accountId } = req.body;
    const loan = await Loan.findOne({ _id: req.params.id, userId: req.user._id });

    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    if (loan.status !== 'disbursed') {
      return res.status(400).json({ success: false, message: 'Only active disbursed loans can be repaid.' });
    }

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    if (account.balance < loan.emiAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance to pay EMI.' });
    }

    // Deduct EMI from account
    account.balance -= loan.emiAmount;
    account.ledgerBalance = account.balance;
    await account.save();

    // Deduct from outstanding loan balance
    loan.outstandingAmount = Math.max(0, loan.outstandingAmount - loan.emiAmount);
    const refNum = 'EMI' + Date.now();

    loan.repaymentHistory.push({
      amount: loan.emiAmount,
      paidAt: new Date(),
      referenceNumber: refNum,
      status: 'Success'
    });

    // Advance next EMI date by 1 month
    const nextDate = new Date(loan.nextEmiDate || new Date());
    nextDate.setMonth(nextDate.getMonth() + 1);
    loan.nextEmiDate = nextDate;

    await loan.save();

    // Record Transaction
    await Transaction.create({
      transactionId: 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
      senderAccountId: account._id,
      senderUserId: req.user._id,
      senderName: req.user.name,
      receiverName: 'Aura Loan Services',
      senderAccountNumber: account.accountNumber,
      amount: loan.emiAmount,
      type: 'debit',
      channel: 'LOAN_REPAYMENT',
      status: 'completed',
      balanceAfter: account.balance,
      referenceNumber: refNum,
      remarks: \`EMI Payment for \${loan.loanType.toUpperCase()} Loan\`,
      category: 'Loan'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'EMI Payment Successful',
      message: \`₹\${loan.emiAmount.toLocaleString('en-IN')} paid for your \${loan.loanType.toUpperCase()} Loan. Ref: \${refNum}\`,
      type: 'loan'
    });

    res.json({ success: true, message: 'EMI repayment completed successfully!', loan });
  } catch (err) {
    next(err);
  }
};
`);

// 7. backend/controllers/fdController.js
writeFile(path.join(backendDir, 'controllers', 'fdController.js'), `
const FixedDeposit = require('../models/FixedDeposit');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.getMyFDs = async (req, res, next) => {
  try {
    const fds = await FixedDeposit.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, fds });
  } catch (err) {
    next(err);
  }
};

exports.createFD = async (req, res, next) => {
  try {
    const { accountId, principalAmount, tenureMonths } = req.body;

    const amount = Number(principalAmount);
    const tenure = Number(tenureMonths);

    if (!amount || amount < 5000 || !tenure || tenure < 3) {
      return res.status(400).json({ success: false, message: 'Minimum FD amount is ₹5,000 and minimum tenure is 3 months.' });
    }

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Debit account not found' });
    }

    if (account.balance < amount) {
      return res.status(400).json({ success: false, message: 'Insufficient account balance for FD principal.' });
    }

    // Deduct principal
    account.balance -= amount;
    account.ledgerBalance = account.balance;
    await account.save();

    const rate = 7.1; // 7.1% p.a.
    // Compound formula: A = P * (1 + r/4)^(4*t) quarterly compounding
    const tYears = tenure / 12;
    const maturityAmount = Math.round(amount * Math.pow(1 + (rate / 100) / 4, 4 * tYears));

    const maturityDate = new Date();
    maturityDate.setMonth(maturityDate.getMonth() + tenure);

    const depositNumber = 'FD' + Date.now().toString().slice(-8);

    const fd = await FixedDeposit.create({
      userId: req.user._id,
      accountId: account._id,
      depositNumber,
      principalAmount: amount,
      interestRate: rate,
      tenureMonths: tenure,
      maturityDate,
      maturityAmount,
      status: 'active'
    });

    const refNum = 'FDREF' + Date.now();
    await Transaction.create({
      transactionId: 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
      senderAccountId: account._id,
      senderUserId: req.user._id,
      senderName: req.user.name,
      receiverName: 'Aura Fixed Deposit Account',
      senderAccountNumber: account.accountNumber,
      amount,
      type: 'debit',
      channel: 'FD_DEPOSIT',
      status: 'completed',
      balanceAfter: account.balance,
      referenceNumber: refNum,
      remarks: \`Opened Fixed Deposit #\${depositNumber}\`,
      category: 'Investment'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Fixed Deposit Created',
      message: \`FD #\${depositNumber} created for ₹\${amount.toLocaleString('en-IN')}. Maturity amount: ₹\${maturityAmount.toLocaleString('en-IN')} on \${maturityDate.toLocaleDateString('en-IN')}.\`,
      type: 'deposit'
    });

    await logAudit(req, 'CREATE_FD', 'FixedDeposit', fd._id, \`Created FD #\${depositNumber} of ₹\${amount}\`);

    res.status(201).json({ success: true, message: 'Fixed Deposit created successfully!', fd });
  } catch (err) {
    next(err);
  }
};

exports.breakFD = async (req, res, next) => {
  try {
    const fd = await FixedDeposit.findOne({ _id: req.params.id, userId: req.user._id });
    if (!fd || fd.status !== 'active') {
      return res.status(400).json({ success: false, message: 'Active Fixed Deposit not found' });
    }

    const account = await Account.findById(fd.accountId);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Original linked account not found' });
    }

    // Premature withdrawal penalty (0.5% interest deduction)
    const refundAmount = fd.principalAmount + Math.round(fd.principalAmount * 0.02); // partial accrued interest
    account.balance += refundAmount;
    account.ledgerBalance = account.balance;
    await account.save();

    fd.status = 'closed_prematurely';
    await fd.save();

    const refNum = 'FDBRK' + Date.now();
    await Transaction.create({
      transactionId: 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
      receiverAccountId: account._id,
      receiverUserId: req.user._id,
      senderName: 'Aura FD Liquidation Desk',
      receiverName: req.user.name,
      receiverAccountNumber: account.accountNumber,
      amount: refundAmount,
      type: 'credit',
      channel: 'FD_MATURITY',
      status: 'completed',
      balanceAfter: account.balance,
      referenceNumber: refNum,
      remarks: \`Premature liquidation of FD #\${fd.depositNumber}\`,
      category: 'Investment'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Fixed Deposit Liquidated',
      message: \`FD #\${fd.depositNumber} closed prematurely. ₹\${refundAmount.toLocaleString('en-IN')} credited to your account.\`,
      type: 'deposit'
    });

    await logAudit(req, 'BREAK_FD', 'FixedDeposit', fd._id, \`Liquidated FD #\${fd.depositNumber}\`);

    res.json({ success: true, message: 'Fixed Deposit liquidated and credited to your account', fd, refundAmount });
  } catch (err) {
    next(err);
  }
};
`);

// 8. backend/controllers/billController.js
writeFile(path.join(backendDir, 'controllers', 'billController.js'), `
const BillPayment = require('../models/BillPayment');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.getBillHistory = async (req, res, next) => {
  try {
    const bills = await BillPayment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, bills });
  } catch (err) {
    next(err);
  }
};

exports.payBill = async (req, res, next) => {
  try {
    const { accountId, category, billerName, consumerNumber, amount } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid bill payment amount' });
    }

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Payment account not found' });
    }

    if (account.balance < numAmount) {
      return res.status(400).json({ success: false, message: 'Insufficient balance to pay bill' });
    }

    account.balance -= numAmount;
    account.ledgerBalance = account.balance;
    await account.save();

    const refNum = 'BILL' + Date.now();
    const txnId = 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

    const bill = await BillPayment.create({
      userId: req.user._id,
      accountId: account._id,
      category,
      billerName,
      consumerNumber,
      amount: numAmount,
      status: 'paid',
      transactionId: txnId,
      referenceNumber: refNum
    });

    await Transaction.create({
      transactionId: txnId,
      senderAccountId: account._id,
      senderUserId: req.user._id,
      senderName: req.user.name,
      receiverName: billerName,
      senderAccountNumber: account.accountNumber,
      amount: numAmount,
      type: 'debit',
      channel: 'BILL_PAY',
      status: 'completed',
      balanceAfter: account.balance,
      referenceNumber: refNum,
      remarks: \`Bill Payment for \${billerName} (\${consumerNumber})\`,
      category: 'Bills'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Bill Payment Successful',
      message: \`₹\${numAmount.toLocaleString('en-IN')} paid to \${billerName}. Ref: \${refNum}\`,
      type: 'transaction'
    });

    await logAudit(req, 'PAY_BILL', 'BillPayment', bill._id, \`Paid \${category} bill of ₹\${numAmount} to \${billerName}\`);

    res.json({
      success: true,
      message: 'Bill payment processed successfully!',
      bill,
      receipt: {
        bankName: 'AURA APEX BANK',
        transactionId: txnId,
        referenceNumber: refNum,
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        billerName,
        category: category.toUpperCase(),
        consumerNumber,
        amount: numAmount,
        status: 'PAID',
        remainingBalance: account.balance
      }
    });
  } catch (err) {
    next(err);
  }
};
`);

// 9. backend/controllers/notificationController.js
writeFile(path.join(backendDir, 'controllers', 'notificationController.js'), `
const Notification = require('../models/Notification');

exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({
      $or: [
        { recipientUserId: req.user._id },
        { recipientUserId: null, targetRole: { $in: ['all', req.user.role] } }
      ]
    }).sort({ createdAt: -1 }).limit(50);

    const unreadCount = notifications.filter(n => !n.isRead).length;

    res.json({ success: true, count: notifications.length, unreadCount, notifications });
  } catch (err) {
    next(err);
  }
};

exports.markAsRead = async (req, res, next) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    res.json({ success: true, message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.markAllAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      {
        $or: [
          { recipientUserId: req.user._id },
          { recipientUserId: null }
        ],
        isRead: false
      },
      { isRead: true }
    );

    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (err) {
    next(err);
  }
};

exports.deleteNotification = async (req, res, next) => {
  try {
    await Notification.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Notification deleted' });
  } catch (err) {
    next(err);
  }
};
`);

console.log('Controllers Part 2 created successfully!');