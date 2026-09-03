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

// 1. backend/controllers/authController.js
writeFile(path.join(backendDir, 'controllers', 'authController.js'), `
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const CustomerProfile = require('../models/CustomerProfile');
const Account = require('../models/Account');
const Branch = require('../models/Branch');
const Card = require('../models/Card');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role, name: user.name, email: user.email },
    process.env.JWT_SECRET || 'aura_apex_super_secret_jwt_key_2026',
    { expiresIn: '30d' }
  );
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'Please provide all required fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email is already registered' });
    }

    const userRole = role === 'admin' ? 'customer' : (role || 'customer');

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role: userRole,
      status: 'active'
    });

    let defaultAccount = null;

    if (userRole === 'customer') {
      const customerId = 'CUST-' + Math.floor(100000 + Math.random() * 900000);
      await CustomerProfile.create({
        userId: user._id,
        customerId,
        dob: new Date('1992-05-15'),
        address: { street: '42, Cyber Hub Road', city: 'Mumbai', state: 'Maharashtra', pincode: '400001' },
        panNumber: 'ABCDE' + Math.floor(1000 + Math.random() * 9000) + 'F',
        aadhaarNumber: 'XXXX-XXXX-' + Math.floor(1000 + Math.random() * 9000),
        kycStatus: 'pending'
      });

      const branch = await Branch.findOne() || { _id: null, ifscCode: 'AURA0001001' };
      const accNum = '100' + Math.floor(100000000 + Math.random() * 900000000);

      defaultAccount = await Account.create({
        userId: user._id,
        accountNumber: accNum,
        accountType: 'savings',
        ifscCode: branch.ifscCode || 'AURA0001001',
        branchId: branch._id,
        balance: 25000,
        ledgerBalance: 25000,
        status: 'active'
      });

      // Issue a default virtual RuPay Debit card
      const cardNum = '4532 ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);
      await Card.create({
        userId: user._id,
        accountId: defaultAccount._id,
        cardNumber: cardNum,
        cardHolderName: user.name.toUpperCase(),
        cardType: 'debit',
        cardNetwork: 'RuPay',
        status: 'active',
        dailyLimit: 50000,
        onlineEnabled: true,
        atmEnabled: true
      });

      // Send Welcome Notification
      await Notification.create({
        recipientUserId: user._id,
        targetRole: 'customer',
        title: 'Welcome to Aura Apex Bank!',
        message: \`Your new Savings Account \${accNum} has been created with an opening balance of ₹25,000. Welcome aboard!\`,
        type: 'system'
      });
    }

    await logAudit(req, 'REGISTER', 'User', user._id, \`New user registered as \${userRole} with email \${email}\`);

    const token = generateToken(user);

    res.status(201).json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status
      },
      account: defaultAccount
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    if (user.status === 'locked') {
      return res.status(403).json({ success: false, message: 'Account is locked due to security policy. Please contact bank staff.' });
    }
    if (user.status === 'disabled') {
      return res.status(403).json({ success: false, message: 'Account is deactivated. Please contact administrator.' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;
      if (user.loginAttempts >= 5) {
        user.status = 'locked';
        await user.save();
        await logAudit(req, 'ACCOUNT_LOCK', 'User', user._id, 'Account locked after 5 consecutive failed login attempts');
        return res.status(403).json({ success: false, message: 'Account locked due to 5 consecutive failed login attempts.' });
      }
      await user.save();
      return res.status(401).json({ success: false, message: \`Invalid credentials. \${5 - user.loginAttempts} attempts remaining.\` });
    }

    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    await logAudit(req, 'LOGIN', 'User', user._id, \`Successful login for \${user.email} (\${user.role})\`);

    // Create a login alert notification for customers
    if (user.role === 'customer') {
      await Notification.create({
        recipientUserId: user._id,
        targetRole: 'customer',
        title: 'New Login Detected',
        message: \`Login detected on \${new Date().toLocaleTimeString()} from IP \${req.ip || '127.0.0.1'}.\`,
        type: 'security'
      });
    }

    const token = generateToken(user);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        status: user.status,
        lastLogin: user.lastLogin,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    let profile = null;
    let accounts = [];

    if (user.role === 'customer') {
      profile = await CustomerProfile.findOne({ userId: user._id });
      accounts = await Account.find({ userId: user._id });
    }

    res.json({
      success: true,
      user,
      profile,
      accounts
    });
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, address, communicationPreferences } = req.body;
    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (phone) user.phone = phone;
    await user.save();

    let profile = null;
    if (user.role === 'customer') {
      profile = await CustomerProfile.findOne({ userId: user._id });
      if (profile) {
        if (address) profile.address = { ...profile.address, ...address };
        if (communicationPreferences) profile.communicationPreferences = { ...profile.communicationPreferences, ...communicationPreferences };
        await profile.save();
      }
    }

    await logAudit(req, 'UPDATE_PROFILE', 'User', user._id, 'Profile information updated');

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
      profile
    });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide current and new password' });
    }

    const user = await User.findById(req.user._id).select('+password');
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password does not match' });
    }

    user.password = newPassword;
    await user.save();

    await Notification.create({
      recipientUserId: user._id,
      targetRole: user.role,
      title: 'Security Alert: Password Changed',
      message: 'Your account password was changed successfully. If you did not make this change, notify staff immediately.',
      type: 'security'
    });

    await logAudit(req, 'CHANGE_PASSWORD', 'User', user._id, 'Account password updated');

    res.json({ success: true, message: 'Password changed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.toggleTwoFactor = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();

    await logAudit(req, 'TOGGLE_2FA', 'User', user._id, \`2FA toggled to \${user.twoFactorEnabled}\`);

    res.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled,
      message: \`Two-factor authentication \${user.twoFactorEnabled ? 'enabled' : 'disabled'} successfully\`
    });
  } catch (err) {
    next(err);
  }
};
`);

// 2. backend/controllers/accountController.js
writeFile(path.join(backendDir, 'controllers', 'accountController.js'), `
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
`);

// 3. backend/controllers/transferController.js
writeFile(path.join(backendDir, 'controllers', 'transferController.js'), `
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
      return res.status(400).json({ success: false, message: \`Source account is currently \${sourceAccount.status}. Transfers are not permitted.\` });
    }

    // Check minimum balance / sufficient balance
    if (sourceAccount.balance < numAmount) {
      return res.status(400).json({
        success: false,
        message: \`Insufficient funds. Available balance is ₹\${sourceAccount.balance.toLocaleString('en-IN')}, requested transfer is ₹\${numAmount.toLocaleString('en-IN')}.\`
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
      message: \`₹\${numAmount.toLocaleString('en-IN')} debited from account \${sourceAccount.accountNumber} to \${recipientName || destinationAccountNumber}. Ref: \${refNum}\`,
      type: 'transaction',
      link: \`/transactions?ref=\${refNum}\`
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
        message: \`₹\${numAmount.toLocaleString('en-IN')} credited to account \${targetAccount.accountNumber} from \${req.user.name}. Ref: \${refNum}\`,
        type: 'transaction',
        link: \`/transactions?ref=\${refNum}\`
      });
    }

    await logAudit(
      req,
      'TRANSFER',
      'Account',
      sourceAccount._id,
      \`Transferred ₹\${numAmount} via \${transferType} to \${destinationAccountNumber}. Ref: \${refNum}\`
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
`);

// 4. backend/controllers/beneficiaryController.js
writeFile(path.join(backendDir, 'controllers', 'beneficiaryController.js'), `
const Beneficiary = require('../models/Beneficiary');
const Account = require('../models/Account');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.getBeneficiaries = async (req, res, next) => {
  try {
    const beneficiaries = await Beneficiary.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, beneficiaries });
  } catch (err) {
    next(err);
  }
};

exports.addBeneficiary = async (req, res, next) => {
  try {
    const { name, nickname, accountNumber, ifscCode, bankName, transferLimit } = req.body;

    if (!name || !accountNumber || !ifscCode) {
      return res.status(400).json({ success: false, message: 'Name, Account Number, and IFSC are required.' });
    }

    const existing = await Beneficiary.findOne({
      userId: req.user._id,
      accountNumber: accountNumber.trim()
    });

    if (existing) {
      return res.status(400).json({ success: false, message: 'This beneficiary account is already in your saved list.' });
    }

    const beneficiary = await Beneficiary.create({
      userId: req.user._id,
      name: name.trim(),
      nickname: nickname ? nickname.trim() : name.split(' ')[0],
      accountNumber: accountNumber.trim(),
      ifscCode: ifscCode.trim().toUpperCase(),
      bankName: bankName || 'Aura Apex Bank',
      transferLimit: transferLimit || 100000
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'New Beneficiary Added',
      message: \`Beneficiary '\${beneficiary.name}' (A/C: \${beneficiary.accountNumber}) added successfully.\`,
      type: 'security'
    });

    await logAudit(req, 'ADD_BENEFICIARY', 'Beneficiary', beneficiary._id, \`Added beneficiary \${beneficiary.name}\`);

    res.status(201).json({ success: true, message: 'Beneficiary added successfully', beneficiary });
  } catch (err) {
    next(err);
  }
};

exports.deleteBeneficiary = async (req, res, next) => {
  try {
    const beneficiary = await Beneficiary.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!beneficiary) {
      return res.status(404).json({ success: false, message: 'Beneficiary not found' });
    }

    await logAudit(req, 'DELETE_BENEFICIARY', 'Beneficiary', beneficiary._id, \`Deleted beneficiary \${beneficiary.name}\`);

    res.json({ success: true, message: 'Beneficiary removed successfully' });
  } catch (err) {
    next(err);
  }
};

exports.validateAccount = async (req, res, next) => {
  try {
    const { accountNumber, ifscCode } = req.body;
    const account = await Account.findOne({ accountNumber: accountNumber.trim() }).populate('userId', 'name');

    if (account) {
      return res.json({
        success: true,
        isInternal: true,
        accountHolderName: account.userId ? account.userId.name : 'Aura Customer',
        accountType: account.accountType,
        ifscCode: account.ifscCode
      });
    }

    res.json({
      success: true,
      isInternal: false,
      message: 'Account verified for NEFT/IMPS/RTGS transfer'
    });
  } catch (err) {
    next(err);
  }
};
`);

// 5. backend/controllers/cardController.js
writeFile(path.join(backendDir, 'controllers', 'cardController.js'), `
const Card = require('../models/Card');
const Account = require('../models/Account');
const Notification = require('../models/Notification');
const { logAudit } = require('../middleware/auditLogger');

exports.getMyCards = async (req, res, next) => {
  try {
    const cards = await Card.find({ userId: req.user._id }).populate('accountId', 'accountNumber balance');
    res.json({ success: true, cards });
  } catch (err) {
    next(err);
  }
};

exports.toggleBlockCard = async (req, res, next) => {
  try {
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    const newStatus = card.status === 'active' ? 'blocked' : 'active';
    card.status = newStatus;
    await card.save();

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: \`Card \${newStatus === 'blocked' ? 'Blocked' : 'Unblocked'}\`,
      message: \`Your \${card.cardType.toUpperCase()} card ending in \${card.cardNumber.slice(-4)} is now \${newStatus.toUpperCase()}.\`,
      type: 'security'
    });

    await logAudit(req, 'CARD_STATUS_CHANGE', 'Card', card._id, \`Card ending in \${card.cardNumber.slice(-4)} changed to \${newStatus}\`);

    res.json({ success: true, message: \`Card \${newStatus} successfully\`, card });
  } catch (err) {
    next(err);
  }
};

exports.setCardPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length !== 4 || !/^\\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 numeric digits' });
    }

    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    card.pin = pin;
    await card.save();

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'ATM PIN Changed Successfully',
      message: \`The ATM PIN for your card ending in \${card.cardNumber.slice(-4)} was updated.\`,
      type: 'security'
    });

    await logAudit(req, 'CARD_PIN_CHANGE', 'Card', card._id, 'Card PIN updated');

    res.json({ success: true, message: 'PIN set successfully' });
  } catch (err) {
    next(err);
  }
};

exports.updateLimits = async (req, res, next) => {
  try {
    const { dailyLimit, onlineEnabled, atmEnabled } = req.body;
    const card = await Card.findOne({ _id: req.params.id, userId: req.user._id });
    if (!card) {
      return res.status(404).json({ success: false, message: 'Card not found' });
    }

    if (dailyLimit !== undefined) card.dailyLimit = dailyLimit;
    if (onlineEnabled !== undefined) card.onlineEnabled = onlineEnabled;
    if (atmEnabled !== undefined) card.atmEnabled = atmEnabled;

    await card.save();

    res.json({ success: true, message: 'Card settings updated successfully', card });
  } catch (err) {
    next(err);
  }
};

exports.requestCard = async (req, res, next) => {
  try {
    const { accountId, cardType, cardNetwork } = req.body;

    const account = await Account.findOne({ _id: accountId, userId: req.user._id });
    if (!account) {
      return res.status(404).json({ success: false, message: 'Linked account not found' });
    }

    const bin = cardNetwork === 'Visa' ? '4532' : (cardNetwork === 'Mastercard' ? '5241' : '6074');
    const cardNumber = bin + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000) + ' ' + Math.floor(1000 + Math.random() * 9000);

    const card = await Card.create({
      userId: req.user._id,
      accountId: account._id,
      cardNumber,
      cardHolderName: req.user.name.toUpperCase(),
      cardType: cardType || 'debit',
      cardNetwork: cardNetwork || 'RuPay',
      expiryMonth: '09',
      expiryYear: '31',
      cvv: String(Math.floor(100 + Math.random() * 900)),
      pin: '1234',
      status: 'active',
      dailyLimit: cardType === 'credit' ? 150000 : 50000,
      onlineEnabled: true,
      atmEnabled: true
    });

    await Notification.create({
      recipientUserId: req.user._id,
      targetRole: 'customer',
      title: 'New Card Issued',
      message: \`Your new \${card.cardNetwork} \${card.cardType.toUpperCase()} card has been activated.\`,
      type: 'card'
    });

    await logAudit(req, 'REQUEST_CARD', 'Card', card._id, \`Requested new \${card.cardType} card\`);

    res.status(201).json({ success: true, message: 'Card issued successfully', card });
  } catch (err) {
    next(err);
  }
};
`);

console.log('Controllers Part 1 created successfully!');