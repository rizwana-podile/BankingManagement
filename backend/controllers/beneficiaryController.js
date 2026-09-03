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
      message: `Beneficiary '${beneficiary.name}' (A/C: ${beneficiary.accountNumber}) added successfully.`,
      type: 'security'
    });

    await logAudit(req, 'ADD_BENEFICIARY', 'Beneficiary', beneficiary._id, `Added beneficiary ${beneficiary.name}`);

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

    await logAudit(req, 'DELETE_BENEFICIARY', 'Beneficiary', beneficiary._id, `Deleted beneficiary ${beneficiary.name}`);

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
