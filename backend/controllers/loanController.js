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
      message: `Your application for ${loanType.toUpperCase()} Loan of ₹${amount.toLocaleString('en-IN')} has been submitted for review.`,
      type: 'loan'
    });

    await logAudit(req, 'APPLY_LOAN', 'Loan', loan._id, `Applied for ${loanType} loan of ₹${amount}`);

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
      remarks: `EMI Payment for ${loan.loanType.toUpperCase()} Loan`,
      category: 'Loan'
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'EMI Payment Successful',
      message: `₹${loan.emiAmount.toLocaleString('en-IN')} paid for your ${loan.loanType.toUpperCase()} Loan. Ref: ${refNum}`,
      type: 'loan'
    });

    res.json({ success: true, message: 'EMI repayment completed successfully!', loan });
  } catch (err) {
    next(err);
  }
};
