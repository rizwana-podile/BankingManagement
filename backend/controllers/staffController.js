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
      message: `Your banking profile status has been set to ${status.toUpperCase()} by branch operations.`,
      type: 'security'
    });

    await logAudit(req, 'UPDATE_CUSTOMER_STATUS', 'User', user._id, `Customer ${user.name} status updated to ${status}`);

    res.json({ success: true, message: `Customer status updated to ${status}`, user });
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
      message: `New ${accountType.toUpperCase()} Account ${accNum} opened with opening balance of ₹${deposit.toLocaleString('en-IN')}.`,
      type: 'system'
    });

    await logAudit(req, 'OPEN_ACCOUNT', 'Account', account._id, `Opened ${accountType} account ${accNum} for ${user.name}`);

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
      title: `Account ${status === 'frozen' ? 'Frozen' : 'Unfrozen'}`,
      message: `Your account ${account.accountNumber} has been ${status}. Reason: ${reason || 'Administrative action'}.`,
      type: 'security'
    });

    await logAudit(req, 'ACCOUNT_FREEZE', 'Account', account._id, `Account ${account.accountNumber} status set to ${status}. Reason: ${reason}`);

    res.json({ success: true, message: `Account status set to ${status}`, account });
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
      title: `KYC Verification ${status.toUpperCase()}`,
      message: `Your KYC verification has been ${status}. Notes: ${notes || 'All verification checks passed'}.`,
      type: 'kyc'
    });

    await logAudit(req, 'REVIEW_KYC', 'CustomerProfile', profile._id, `KYC status for ${profile.userId.name} set to ${status}`);

    res.json({ success: true, message: `KYC has been ${status}`, profile });
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
      title: `Loan Application ${status.toUpperCase()}`,
      message: `Your ${loan.loanType.toUpperCase()} loan application for ₹${loan.loanAmount.toLocaleString('en-IN')} has been ${status}. ${remarks || ''}`,
      type: 'loan'
    });

    await logAudit(req, 'REVIEW_LOAN', 'Loan', loan._id, `Loan #${loan._id} set to ${status}`);

    res.json({ success: true, message: `Loan application ${status}`, loan });
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
      remarks: `Disbursement of ${loan.loanType.toUpperCase()} Loan`,
      category: 'Loan'
    });

    await Notification.create({
      recipientUserId: loan.userId._id,
      targetRole: 'customer',
      title: 'Loan Disbursed to Account',
      message: `₹${disburseAmount.toLocaleString('en-IN')} has been credited to your account ${account.accountNumber} for your ${loan.loanType} loan.`,
      type: 'loan'
    });

    await logAudit(req, 'DISBURSE_LOAN', 'Loan', loan._id, `Disbursed ₹${disburseAmount} for loan to ${loan.userId.name}`);

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

    await logAudit(req, 'FLAG_TRANSACTION', 'Transaction', txn._id, `Transaction flagged suspicious: ${isSuspicious}`);

    res.json({ success: true, message: 'Transaction flagged status updated', transaction: txn });
  } catch (err) {
    next(err);
  }
};
