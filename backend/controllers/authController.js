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
        message: `Your new Savings Account ${accNum} has been created with an opening balance of ₹25,000. Welcome aboard!`,
        type: 'system'
      });
    }

    await logAudit(req, 'REGISTER', 'User', user._id, `New user registered as ${userRole} with email ${email}`);

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
      return res.status(401).json({ success: false, message: `Invalid credentials. ${5 - user.loginAttempts} attempts remaining.` });
    }

    user.loginAttempts = 0;
    user.lastLogin = new Date();
    await user.save();

    await logAudit(req, 'LOGIN', 'User', user._id, `Successful login for ${user.email} (${user.role})`);

    // Create a login alert notification for customers
    if (user.role === 'customer') {
      await Notification.create({
        recipientUserId: user._id,
        targetRole: 'customer',
        title: 'New Login Detected',
        message: `Login detected on ${new Date().toLocaleTimeString()} from IP ${req.ip || '127.0.0.1'}.`,
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

    await logAudit(req, 'TOGGLE_2FA', 'User', user._id, `2FA toggled to ${user.twoFactorEnabled}`);

    res.json({
      success: true,
      twoFactorEnabled: user.twoFactorEnabled,
      message: `Two-factor authentication ${user.twoFactorEnabled ? 'enabled' : 'disabled'} successfully`
    });
  } catch (err) {
    next(err);
  }
};
