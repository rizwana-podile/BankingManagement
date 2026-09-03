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

// 10. backend/controllers/staffController.js
writeFile(path.join(backendDir, 'controllers', 'staffController.js'), `
const User = require('../models/User');
const CustomerProfile = require('../models/CustomerProfile');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.getStaffOverview = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const activeCustomers = await User.countDocuments({ role: 'customer', status: 'active' });

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const newCustomersToday = await User.countDocuments({
      role: 'customer',
      createdAt: { $gte: todayStart }
    });

    const accounts = await Account.find({ status: { $ne: 'closed' } });
    const totalDeposits = accounts.reduce((acc, curr) => acc + (curr.balance || 0), 0);

    const withdrawalsAgg = await Transaction.aggregate([
      { $match: { type: 'debit', status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalWithdrawals = withdrawalsAgg[0] ? withdrawalsAgg[0].total : 0;

    const pendingKYC = await CustomerProfile.countDocuments({ kycStatus: { $in: ['pending', 'under_review'] } });
    const pendingLoans = await Loan.countDocuments({ status: { $in: ['submitted', 'under_review'] } });

    const todayTxns = await Transaction.find({ createdAt: { $gte: todayStart } }).sort({ createdAt: -1 });

    res.json({
      success: true,
      stats: {
        totalCustomers,
        activeCustomers,
        newCustomersToday,
        totalDeposits,
        totalWithdrawals,
        pendingKYC,
        pendingLoans,
        todayTransactionsCount: todayTxns.length,
        todayTransactionsVolume: todayTxns.reduce((sum, t) => sum + t.amount, 0)
      },
      recentTransactions: todayTxns.slice(0, 10)
    });
  } catch (err) {
    next(err);
  }
};

exports.getCustomers = async (req, res, next) => {
  try {
    const { search, status, kycStatus } = req.query;

    let userQuery = { role: 'customer' };
    if (status && status !== 'all') {
      userQuery.status = status;
    }

    if (search) {
      userQuery.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const customers = await User.find(userQuery).sort({ createdAt: -1 });
    const customerIds = customers.map(c => c._id);

    const profiles = await CustomerProfile.find({ userId: { $in: customerIds } });
    const accounts = await Account.find({ userId: { $in: customerIds } });

    const profileMap = {};
    profiles.forEach(p => { profileMap[p.userId.toString()] = p; });

    const accountMap = {};
    accounts.forEach(a => {
      const uid = a.userId.toString();
      if (!accountMap[uid]) accountMap[uid] = [];
      accountMap[uid].push(a);
    });

    let results = customers.map(c => {
      const p = profileMap[c._id.toString()] || {};
      const accs = accountMap[c._id.toString()] || [];
      const totalBalance = accs.reduce((sum, a) => sum + a.balance, 0);

      return {
        _id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        status: c.status,
        createdAt: c.createdAt,
        customerId: p.customerId || 'CUST-GEN',
        kycStatus: p.kycStatus || 'pending',
        accountsCount: accs.length,
        totalBalance,
        accounts: accs
      };
    });

    if (kycStatus && kycStatus !== 'all') {
      results = results.filter(r => r.kycStatus === kycStatus);
    }

    res.json({ success: true, count: results.length, customers: results });
  } catch (err) {
    next(err);
  }
};

exports.getCustomerDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const profile = await CustomerProfile.findOne({ userId: user._id });
    const accounts = await Account.find({ userId: user._id }).populate('branchId', 'branchName ifscCode');
    const loans = await Loan.find({ userId: user._id });
    const transactions = await Transaction.find({
      $or: [{ senderUserId: user._id }, { receiverUserId: user._id }]
    }).sort({ createdAt: -1 }).limit(20);

    res.json({
      success: true,
      customer: {
        user,
        profile,
        accounts,
        loans,
        recentTransactions: transactions
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.updateCustomerStatus = async (req, res, next) => {
  try {
    const { status } = req.body; // 'active', 'locked', 'disabled'
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    user.status = status;
    if (status === 'active') user.loginAttempts = 0;
    await user.save();

    await Notification.create({
      recipientUserId: user._id,
      targetRole: 'customer',
      title: 'Account Status Update',
      message: \`Your banking profile status has been set to \${status.toUpperCase()} by branch operations.\`,
      type: 'security'
    });

    await logAudit(req, 'UPDATE_CUSTOMER_STATUS', 'User', user._id, \`Customer \${user.name} status updated to \${status}\`);

    res.json({ success: true, message: \`Customer status updated to \${status}\`, user });
  } catch (err) {
    next(err);
  }
};

exports.openCustomerAccount = async (req, res, next) => {
  try {
    const { userId, accountType, initialDeposit, branchId } = req.body;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const deposit = Number(initialDeposit) || 10000;
    const accNum = '100' + Math.floor(100000000 + Math.random() * 900000000);

    const account = await Account.create({
      userId: user._id,
      accountNumber: accNum,
      accountType: accountType || 'savings',
      ifscCode: 'AURA0001001',
      branchId: branchId || null,
      balance: deposit,
      ledgerBalance: deposit,
      status: 'active'
    });

    await Notification.create({
      recipientUserId: user._id,
      targetRole: 'customer',
      title: 'New Account Opened',
      message: \`New \${accountType.toUpperCase()} Account \${accNum} opened with opening balance of ₹\${deposit.toLocaleString('en-IN')}.\`,
      type: 'system'
    });

    await logAudit(req, 'OPEN_ACCOUNT', 'Account', account._id, \`Opened \${accountType} account \${accNum} for \${user.name}\`);

    res.status(201).json({ success: true, message: 'Account opened successfully', account });
  } catch (err) {
    next(err);
  }
};

exports.freezeAccount = async (req, res, next) => {
  try {
    const { status, reason } = req.body; // 'active', 'frozen', 'closed'
    const account = await Account.findById(req.params.id);
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    account.status = status;
    await account.save();

    await Notification.create({
      recipientUserId: account.userId,
      targetRole: 'customer',
      title: \`Account \${status === 'frozen' ? 'Frozen' : 'Unfrozen'}\`,
      message: \`Your account \${account.accountNumber} has been \${status}. Reason: \${reason || 'Administrative action'}.\`,
      type: 'security'
    });

    await logAudit(req, 'ACCOUNT_FREEZE', 'Account', account._id, \`Account \${account.accountNumber} status set to \${status}. Reason: \${reason}\`);

    res.json({ success: true, message: \`Account status set to \${status}\`, account });
  } catch (err) {
    next(err);
  }
};

exports.getKYCQueue = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.kycStatus = status;
    }

    const profiles = await CustomerProfile.find(query).populate('userId', 'name email phone status').sort({ updatedAt: -1 });
    res.json({ success: true, count: profiles.length, profiles });
  } catch (err) {
    next(err);
  }
};

exports.reviewKYC = async (req, res, next) => {
  try {
    const { status, notes } = req.body; // 'approved', 'rejected', 'under_review'
    const profile = await CustomerProfile.findById(req.params.id).populate('userId');
    if (!profile) {
      return res.status(404).json({ success: false, message: 'KYC record not found' });
    }

    profile.kycStatus = status;
    profile.reviewerNotes = notes || '';
    profile.reviewedBy = req.user._id;
    profile.reviewedAt = new Date();
    await profile.save();

    await Notification.create({
      recipientUserId: profile.userId._id,
      targetRole: 'customer',
      title: \`KYC Verification \${status.toUpperCase()}\`,
      message: \`Your KYC verification has been \${status}. Notes: \${notes || 'All verification checks passed'}.\`,
      type: 'kyc'
    });

    await logAudit(req, 'REVIEW_KYC', 'CustomerProfile', profile._id, \`KYC status for \${profile.userId.name} set to \${status}\`);

    res.json({ success: true, message: \`KYC has been \${status}\`, profile });
  } catch (err) {
    next(err);
  }
};

exports.getLoanQueue = async (req, res, next) => {
  try {
    const { status } = req.query;
    let query = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const loans = await Loan.find(query).populate('userId', 'name email phone').sort({ createdAt: -1 });
    res.json({ success: true, count: loans.length, loans });
  } catch (err) {
    next(err);
  }
};

exports.reviewLoan = async (req, res, next) => {
  try {
    const { status, remarks, approvedAmount } = req.body; // 'approved', 'rejected', 'under_review'
    const loan = await Loan.findById(req.params.id).populate('userId');
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan application not found' });
    }

    loan.status = status;
    loan.remarks = remarks || '';
    loan.reviewedBy = req.user._id;
    if (approvedAmount) {
      loan.approvedAmount = Number(approvedAmount);
    }
    await loan.save();

    await Notification.create({
      recipientUserId: loan.userId._id,
      targetRole: 'customer',
      title: \`Loan Application \${status.toUpperCase()}\`,
      message: \`Your \${loan.loanType.toUpperCase()} loan application for ₹\${loan.loanAmount.toLocaleString('en-IN')} has been \${status}. \${remarks || ''}\`,
      type: 'loan'
    });

    await logAudit(req, 'REVIEW_LOAN', 'Loan', loan._id, \`Loan #\${loan._id} set to \${status}\`);

    res.json({ success: true, message: \`Loan application \${status}\`, loan });
  } catch (err) {
    next(err);
  }
};

exports.disburseLoan = async (req, res, next) => {
  try {
    const loan = await Loan.findById(req.params.id).populate('userId');
    if (!loan) {
      return res.status(404).json({ success: false, message: 'Loan not found' });
    }

    if (loan.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Only approved loans can be disbursed' });
    }

    const account = await Account.findOne({ userId: loan.userId._id, status: 'active' });
    if (!account) {
      return res.status(400).json({ success: false, message: 'Customer has no active account for fund disbursement' });
    }

    const disburseAmount = loan.approvedAmount || loan.loanAmount;

    account.balance += disburseAmount;
    account.ledgerBalance = account.balance;
    await account.save();

    loan.status = 'disbursed';
    loan.outstandingAmount = disburseAmount;
    await loan.save();

    const refNum = 'DISB' + Date.now();
    await Transaction.create({
      transactionId: 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000),
      receiverAccountId: account._id,
      receiverUserId: loan.userId._id,
      senderName: 'Aura Credit & Lending Dept',
      receiverName: loan.userId.name,
      receiverAccountNumber: account.accountNumber,
      amount: disburseAmount,
      type: 'credit',
      channel: 'LOAN_DISBURSEMENT',
      status: 'completed',
      balanceAfter: account.balance,
      referenceNumber: refNum,
      remarks: \`Disbursement of \${loan.loanType.toUpperCase()} Loan\`,
      category: 'Loan'
    });

    await Notification.create({
      recipientUserId: loan.userId._id,
      targetRole: 'customer',
      title: 'Loan Disbursed to Account',
      message: \`₹\${disburseAmount.toLocaleString('en-IN')} has been credited to your account \${account.accountNumber} for your \${loan.loanType} loan.\`,
      type: 'loan'
    });

    await logAudit(req, 'DISBURSE_LOAN', 'Loan', loan._id, \`Disbursed ₹\${disburseAmount} for loan to \${loan.userId.name}\`);

    res.json({ success: true, message: 'Loan successfully disbursed!', loan, account });
  } catch (err) {
    next(err);
  }
};

exports.getTransactionsMonitoring = async (req, res, next) => {
  try {
    const { filter, search } = req.query; // 'all', 'high_value', 'suspicious', 'failed'
    let query = {};

    if (filter === 'high_value') {
      query.amount = { $gte: 100000 };
    } else if (filter === 'suspicious') {
      query.isSuspicious = true;
    } else if (filter === 'failed') {
      query.status = 'failed';
    }

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { receiverName: { $regex: search, $options: 'i' } },
        { senderAccountNumber: { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

exports.flagTransaction = async (req, res, next) => {
  try {
    const { isSuspicious, flaggedReason } = req.body;
    const txn = await Transaction.findById(req.params.id);
    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    txn.isSuspicious = Boolean(isSuspicious);
    txn.flaggedReason = flaggedReason || '';
    await txn.save();

    await logAudit(req, 'FLAG_TRANSACTION', 'Transaction', txn._id, \`Transaction flagged suspicious: \${isSuspicious}\`);

    res.json({ success: true, message: 'Transaction flagged status updated', transaction: txn });
  } catch (err) {
    next(err);
  }
};
`);

// 11. backend/controllers/adminController.js
writeFile(path.join(backendDir, 'controllers', 'adminController.js'), `
const User = require('../models/User');
const CustomerProfile = require('../models/CustomerProfile');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Loan = require('../models/Loan');
const Branch = require('../models/Branch');
const Notification = require('../models/Notification');
const AuditLog = require('../models/AuditLog');
const { logAudit } = require('../middleware/auditLogger');

exports.getAdminStats = async (req, res, next) => {
  try {
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalEmployees = await User.countDocuments({ role: { $in: ['employee', 'admin'] } });
    const totalAccounts = await Account.countDocuments();

    const accounts = await Account.find({ status: { $ne: 'closed' } });
    const totalDeposits = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

    const totalTransactions = await Transaction.countDocuments();
    const failedTransactions = await Transaction.countDocuments({ status: 'failed' });

    const loans = await Loan.find();
    const totalLoans = loans.length;
    const activeLoans = loans.filter(l => l.status === 'disbursed').length;
    const activeLoansValue = loans.filter(l => l.status === 'disbursed').reduce((sum, l) => sum + l.outstandingAmount, 0);

    const pendingApprovals = (await CustomerProfile.countDocuments({ kycStatus: 'pending' })) +
      (await Loan.countDocuments({ status: 'submitted' }));

    // Chart Data: Monthly Transaction Volume (last 6 months)
    const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    const monthlyTransactionsData = [
      { month: 'Apr', volume: 4200000, count: 320, deposits: 2500000, withdrawals: 1700000 },
      { month: 'May', volume: 5100000, count: 410, deposits: 3100000, withdrawals: 2000000 },
      { month: 'Jun', volume: 4800000, count: 390, deposits: 2900000, withdrawals: 1900000 },
      { month: 'Jul', volume: 6300000, count: 520, deposits: 3800000, withdrawals: 2500000 },
      { month: 'Aug', volume: 7400000, count: 640, deposits: 4600000, withdrawals: 2800000 },
      { month: 'Sep', volume: 8900000, count: 780, deposits: 5400000, withdrawals: 3500000 },
    ];

    const customerGrowthData = [
      { month: 'Apr', customers: 45 },
      { month: 'May', customers: 72 },
      { month: 'Jun', customers: 110 },
      { month: 'Jul', customers: 165 },
      { month: 'Aug', customers: 240 },
      { month: 'Sep', customers: totalCustomers + 250 }
    ];

    const loanStatsData = [
      { name: 'Home Loan', value: 45 },
      { name: 'Personal Loan', value: 25 },
      { name: 'Vehicle Loan', value: 20 },
      { name: 'Education Loan', value: 10 }
    ];

    const channelData = [
      { name: 'UPI', value: 45 },
      { name: 'IMPS', value: 30 },
      { name: 'NEFT', value: 15 },
      { name: 'RTGS', value: 10 }
    ];

    res.json({
      success: true,
      stats: {
        totalCustomers,
        totalEmployees,
        totalAccounts,
        totalDeposits,
        totalTransactions,
        totalLoans,
        activeLoans,
        activeLoansValue,
        pendingApprovals,
        failedTransactions
      },
      charts: {
        monthlyTransactionsData,
        customerGrowthData,
        loanStatsData,
        channelData
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const { role, status, search } = req.query;
    let query = {};

    if (role && role !== 'all') query.role = role;
    if (status && status !== 'all') query.status = status;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, users });
  } catch (err) {
    next(err);
  }
};

exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: role || 'employee',
      status: 'active'
    });

    await logAudit(req, 'CREATE_USER', 'User', user._id, \`Created user \${user.email} with role \${user.role}\`);

    res.status(201).json({ success: true, message: 'User created successfully', user });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { name, phone, role, status } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (role) user.role = role;
    if (status) {
      user.status = status;
      if (status === 'active') user.loginAttempts = 0;
    }

    await user.save();
    await logAudit(req, 'UPDATE_USER', 'User', user._id, \`Updated user \${user.email}\`);

    res.json({ success: true, message: 'User updated successfully', user });
  } catch (err) {
    next(err);
  }
};

exports.resetUserPassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.password = newPassword || 'AuraApex@2026';
    user.status = 'active';
    user.loginAttempts = 0;
    await user.save();

    await logAudit(req, 'RESET_PASSWORD', 'User', user._id, \`Password reset for \${user.email}\`);

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getBranches = async (req, res, next) => {
  try {
    const branches = await Branch.find().sort({ createdAt: -1 });
    res.json({ success: true, branches });
  } catch (err) {
    next(err);
  }
};

exports.createBranch = async (req, res, next) => {
  try {
    const { branchName, branchCode, ifscCode, managerName, address, city, state, phone, email } = req.body;

    const branch = await Branch.create({
      branchName,
      branchCode,
      ifscCode,
      managerName,
      address,
      city,
      state,
      phone,
      email
    });

    await logAudit(req, 'CREATE_BRANCH', 'Branch', branch._id, \`Created branch \${branchName} (\${ifscCode})\`);

    res.status(201).json({ success: true, message: 'Branch created successfully', branch });
  } catch (err) {
    next(err);
  }
};

exports.updateBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    await logAudit(req, 'UPDATE_BRANCH', 'Branch', branch._id, \`Updated branch \${branch.branchName}\`);

    res.json({ success: true, message: 'Branch updated successfully', branch });
  } catch (err) {
    next(err);
  }
};

exports.deleteBranch = async (req, res, next) => {
  try {
    const branch = await Branch.findByIdAndDelete(req.params.id);
    if (!branch) {
      return res.status(404).json({ success: false, message: 'Branch not found' });
    }

    await logAudit(req, 'DELETE_BRANCH', 'Branch', branch._id, \`Deleted branch \${branch.branchName}\`);

    res.json({ success: true, message: 'Branch deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.broadcastNotification = async (req, res, next) => {
  try {
    const { title, message, targetRole, type } = req.body;

    if (!title || !message) {
      return res.status(400).json({ success: false, message: 'Title and message are required' });
    }

    const notification = await Notification.create({
      recipientUserId: null, // Broadcast to all
      targetRole: targetRole || 'all',
      title,
      message,
      type: type || 'system'
    });

    await logAudit(req, 'BROADCAST_NOTIFICATION', 'Notification', notification._id, \`Broadcast: \${title} to \${targetRole || 'all'}\`);

    res.status(201).json({ success: true, message: 'System broadcast published successfully', notification });
  } catch (err) {
    next(err);
  }
};

exports.getAuditLogs = async (req, res, next) => {
  try {
    const { action, role, search, limit } = req.query;
    let query = {};

    if (action && action !== 'all') query.action = action;
    if (role && role !== 'all') query['performedBy.role'] = role;
    if (search) {
      query.$or = [
        { details: { $regex: search, $options: 'i' } },
        { 'performedBy.name': { $regex: search, $options: 'i' } },
        { action: { $regex: search, $options: 'i' } }
      ];
    }

    const logs = await AuditLog.find(query).sort({ timestamp: -1 }).limit(Number(limit) || 100);
    res.json({ success: true, count: logs.length, logs });
  } catch (err) {
    next(err);
  }
};

exports.getReports = async (req, res, next) => {
  try {
    const totalDeposits = (await Account.find({ status: 'active' })).reduce((s, a) => s + a.balance, 0);
    const totalTransactions = await Transaction.countDocuments();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayTransactions = await Transaction.find({ createdAt: { $gte: today } });

    const branches = await Branch.find();
    const branchPerformance = await Promise.all(branches.map(async b => {
      const accs = await Account.find({ branchId: b._id });
      const balance = accs.reduce((s, a) => s + a.balance, 0);
      return {
        branchName: b.branchName,
        ifscCode: b.ifscCode,
        city: b.city,
        accountsCount: accs.length,
        totalBalance: balance
      };
    }));

    res.json({
      success: true,
      reportDate: new Date(),
      summary: {
        totalDeposits,
        totalTransactions,
        todayTransactionsCount: todayTransactions.length,
        todayTransactionsVolume: todayTransactions.reduce((s, t) => s + t.amount, 0)
      },
      branchPerformance
    });
  } catch (err) {
    next(err);
  }
};
`);

console.log('Controllers Part 3 created successfully!');