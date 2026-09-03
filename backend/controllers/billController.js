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
      remarks: `Bill Payment for ${billerName} (${consumerNumber})`,
      category: 'Bills'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'Bill Payment Successful',
      message: `₹${numAmount.toLocaleString('en-IN')} paid to ${billerName}. Ref: ${refNum}`,
      type: 'transaction'
    });

    await logAudit(req, 'PAY_BILL', 'BillPayment', bill._id, `Paid ${category} bill of ₹${numAmount} to ${billerName}`);

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
