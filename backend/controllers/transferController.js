const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.transferFunds = async (req, res, next) => {
  try {
    const {
      sourceAccountId,
      transferType, // 'INTERNAL', 'BENEFICIARY', 'UPI', 'NEFT', 'IMPS', 'RTGS'
      destinationAccountNumber,
      destinationIfsc,
      recipientName,
      amount,
      remarks,
      category
    } = req.body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount <= 0) {
      return res.status(400).json({ success: false, message: 'Transfer amount must be greater than zero.' });
    }

    if (transferType === 'RTGS' && numAmount < 200000) {
      return res.status(400).json({ success: false, message: 'RTGS transfers require a minimum amount of ₹2,00,000.' });
    }

    // 1. Validate source account
    const sourceAccount = await Account.findOne({ _id: sourceAccountId, userId: req.user._id });
    if (!sourceAccount) {
      return res.status(404).json({ success: false, message: 'Source account not found or does not belong to you.' });
    }

    if (sourceAccount.status !== 'active') {
      return res.status(400).json({ success: false, message: `Source account is currently ${sourceAccount.status}. Transfers are not permitted.` });
    }

    // Check minimum balance / sufficient balance
    if (sourceAccount.balance < numAmount) {
      return res.status(400).json({
        success: false,
        message: `Insufficient funds. Available balance is ₹${sourceAccount.balance.toLocaleString('en-IN')}, requested transfer is ₹${numAmount.toLocaleString('en-IN')}.`
      });
    }

    // Reference ID & Txn ID
    const refNum = 'REF' + Date.now() + Math.floor(100 + Math.random() * 900);
    const txnIdSender = 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

    // Check if destination account is inside Aura Apex Bank
    let targetAccount = null;
    if (destinationAccountNumber) {
      targetAccount = await Account.findOne({ accountNumber: destinationAccountNumber.trim() });
    }

    // Perform atomic deduction on sender
    sourceAccount.balance -= numAmount;
    sourceAccount.ledgerBalance = sourceAccount.balance;
    await sourceAccount.save();

    const senderNewBalance = sourceAccount.balance;

    // Record sender transaction (DEBIT)
    const senderTxn = await Transaction.create({
      transactionId: txnIdSender,
      senderAccountId: sourceAccount._id,
      receiverAccountId: targetAccount ? targetAccount._id : null,
      senderUserId: req.user._id,
      receiverUserId: targetAccount ? targetAccount.userId : null,
      senderName: req.user.name,
      receiverName: recipientName || (targetAccount ? 'Aura Customer' : 'External Beneficiary'),
      senderAccountNumber: sourceAccount.accountNumber,
      receiverAccountNumber: destinationAccountNumber,
      senderIfsc: sourceAccount.ifscCode,
      receiverIfsc: destinationIfsc || 'AURA0001001',
      amount: numAmount,
      type: 'debit',
      channel: transferType || 'IMPS',
      status: 'completed',
      balanceAfter: senderNewBalance,
      referenceNumber: refNum,
      remarks: remarks || 'Fund Transfer',
      category: category || 'Transfer'
    });

    // Notify Sender
    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Money Transferred Successfully',
      message: `₹${numAmount.toLocaleString('en-IN')} debited from account ${sourceAccount.accountNumber} to ${recipientName || destinationAccountNumber}. Ref: ${refNum}`,
      type: 'transaction',
      link: `/transactions?ref=${refNum}`
    });

    // If destination account is internal, credit it!
    if (targetAccount && String(targetAccount._id) !== String(sourceAccount._id)) {
      targetAccount.balance += numAmount;
      targetAccount.ledgerBalance = targetAccount.balance;
      await targetAccount.save();

      const txnIdReceiver = 'TXN-' + new Date().getFullYear() + '-' + Math.floor(100000 + Math.random() * 900000);

      await Transaction.create({
        transactionId: txnIdReceiver,
        senderAccountId: sourceAccount._id,
        receiverAccountId: targetAccount._id,
        senderUserId: req.user._id,
        receiverUserId: targetAccount.userId,
        senderName: req.user.name,
        receiverName: recipientName || 'Aura Customer',
        senderAccountNumber: sourceAccount.accountNumber,
        receiverAccountNumber: targetAccount.accountNumber,
        senderIfsc: sourceAccount.ifscCode,
        receiverIfsc: targetAccount.ifscCode,
        amount: numAmount,
        type: 'credit',
        channel: transferType || 'IMPS',
        status: 'completed',
        balanceAfter: targetAccount.balance,
        referenceNumber: refNum,
        remarks: remarks || 'Received Funds',
        category: 'Transfer'
      });

      // Notify Recipient
      await Notification.create({
        recipientUserId: targetAccount.userId,
        targetRole: 'customer',
        title: 'Funds Credited to Your Account',
        message: `₹${numAmount.toLocaleString('en-IN')} credited to account ${targetAccount.accountNumber} from ${req.user.name}. Ref: ${refNum}`,
        type: 'transaction',
        link: `/transactions?ref=${refNum}`
      });
    }

    await logAudit(
      req,
      'TRANSFER',
      'Account',
      sourceAccount._id,
      `Transferred ₹${numAmount} via ${transferType} to ${destinationAccountNumber}. Ref: ${refNum}`
    );

    res.json({
      success: true,
      message: 'Transfer completed successfully!',
      transaction: senderTxn,
      receipt: {
        bankName: 'AURA APEX BANK',
        branch: sourceAccount.ifscCode,
        transactionId: txnIdSender,
        referenceNumber: refNum,
        date: new Date().toLocaleDateString('en-IN'),
        time: new Date().toLocaleTimeString('en-IN'),
        senderName: req.user.name,
        senderAccount: sourceAccount.accountNumber,
        receiverName: recipientName || (targetAccount ? 'Aura Customer' : destinationAccountNumber),
        receiverAccount: destinationAccountNumber,
        receiverIfsc: destinationIfsc || 'AURA0001001',
        amount: numAmount,
        transferType: transferType || 'IMPS',
        status: 'COMPLETED',
        remainingBalance: senderNewBalance,
        remarks: remarks || 'Fund Transfer'
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getTransactions = async (req, res, next) => {
  try {
    const { type, status, channel, dateRange, search } = req.query;

    let query = {
      $or: [
        { senderUserId: req.user._id },
        { receiverUserId: req.user._id }
      ]
    };

    if (type && type !== 'all') {
      // If filtering by type, match transactions where current user is sender (for debit) or receiver (for credit)
      if (type === 'debit') {
        query.senderUserId = req.user._id;
        query.type = 'debit';
      } else if (type === 'credit') {
        query.receiverUserId = req.user._id;
        query.type = 'credit';
      }
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    if (channel && channel !== 'all') {
      query.channel = channel;
    }

    if (dateRange) {
      const now = new Date();
      if (dateRange === 'today') {
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        query.createdAt = { $gte: start };
      } else if (dateRange === 'week') {
        const start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        query.createdAt = { $gte: start };
      } else if (dateRange === 'month') {
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        query.createdAt = { $gte: start };
      }
    }

    if (search) {
      query.$or = [
        { transactionId: { $regex: search, $options: 'i' } },
        { referenceNumber: { $regex: search, $options: 'i' } },
        { receiverName: { $regex: search, $options: 'i' } },
        { senderName: { $regex: search, $options: 'i' } },
        { remarks: { $regex: search, $options: 'i' } }
      ];
    }

    const transactions = await Transaction.find(query).sort({ createdAt: -1 });

    res.json({ success: true, count: transactions.length, transactions });
  } catch (err) {
    next(err);
  }
};

exports.getReceipt = async (req, res, next) => {
  try {
    const txn = await Transaction.findOne({
      $or: [{ transactionId: req.params.id }, { referenceNumber: req.params.id }]
    });

    if (!txn) {
      return res.status(404).json({ success: false, message: 'Transaction receipt not found' });
    }

    res.json({
      success: true,
      receipt: {
        bankName: 'AURA APEX BANK',
        transactionId: txn.transactionId,
        referenceNumber: txn.referenceNumber,
        date: txn.createdAt.toLocaleDateString('en-IN'),
        time: txn.createdAt.toLocaleTimeString('en-IN'),
        senderName: txn.senderName,
        senderAccount: txn.senderAccountNumber,
        senderIfsc: txn.senderIfsc,
        receiverName: txn.receiverName,
        receiverAccount: txn.receiverAccountNumber,
        receiverIfsc: txn.receiverIfsc,
        amount: txn.amount,
        transferType: txn.channel,
        status: txn.status.toUpperCase(),
        remainingBalance: txn.balanceAfter,
        remarks: txn.remarks
      }
    });
  } catch (err) {
    next(err);
  }
};
