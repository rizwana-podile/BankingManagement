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
      remarks: `Opened Fixed Deposit #${depositNumber}`,
      category: 'Investment'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Fixed Deposit Created',
      message: `FD #${depositNumber} created for ₹${amount.toLocaleString('en-IN')}. Maturity amount: ₹${maturityAmount.toLocaleString('en-IN')} on ${maturityDate.toLocaleDateString('en-IN')}.`,
      type: 'deposit'
    });

    await logAudit(req, 'CREATE_FD', 'FixedDeposit', fd._id, `Created FD #${depositNumber} of ₹${amount}`);

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
      remarks: `Premature liquidation of FD #${fd.depositNumber}`,
      category: 'Investment'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Fixed Deposit Liquidated',
      message: `FD #${fd.depositNumber} closed prematurely. ₹${refundAmount.toLocaleString('en-IN')} credited to your account.`,
      type: 'deposit'
    });

    await logAudit(req, 'BREAK_FD', 'FixedDeposit', fd._id, `Liquidated FD #${fd.depositNumber}`);

    res.json({ success: true, message: 'Fixed Deposit liquidated and credited to your account', fd, refundAmount });
  } catch (err) {
    next(err);
  }
};
