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

    await logAudit(req, 'CREATE_USER', 'User', user._id, `Created user ${user.email} with role ${user.role}`);

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
    await logAudit(req, 'UPDATE_USER', 'User', user._id, `Updated user ${user.email}`);

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

    await logAudit(req, 'RESET_PASSWORD', 'User', user._id, `Password reset for ${user.email}`);

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

    await logAudit(req, 'CREATE_BRANCH', 'Branch', branch._id, `Created branch ${branchName} (${ifscCode})`);

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

    await logAudit(req, 'UPDATE_BRANCH', 'Branch', branch._id, `Updated branch ${branch.branchName}`);

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

    await logAudit(req, 'DELETE_BRANCH', 'Branch', branch._id, `Deleted branch ${branch.branchName}`);

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

    await logAudit(req, 'BROADCAST_NOTIFICATION', 'Notification', notification._id, `Broadcast: ${title} to ${targetRole || 'all'}`);

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
