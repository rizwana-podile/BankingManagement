const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

exports.getMyAccounts = async (req, res, next) => {
  try {
    const accounts = await Account.find({ userId: req.user._id }).populate('branchId', 'branchName ifscCode');
    res.json({ success: true, accounts });
  } catch (err) {
    next(err);
  }
};

exports.getAccountDetails = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.user._id }).populate('branchId');
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const transactions = await Transaction.find({
      $or: [{ senderAccountId: account._id }, { receiverAccountId: account._id }]
    }).sort({ createdAt: -1 }).limit(25);

    res.json({ success: true, account, transactions });
  } catch (err) {
    next(err);
  }
};

exports.getMiniStatement = async (req, res, next) => {
  try {
    const account = await Account.findOne({ _id: req.params.id, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    const miniStatement = await Transaction.find({
      $or: [{ senderAccountId: account._id }, { receiverAccountId: account._id }]
    }).sort({ createdAt: -1 }).limit(5);

    res.json({ success: true, miniStatement, balance: account.balance });
  } catch (err) {
    next(err);
  }
};
