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
      title: `Card ${newStatus === 'blocked' ? 'Blocked' : 'Unblocked'}`,
      message: `Your ${card.cardType.toUpperCase()} card ending in ${card.cardNumber.slice(-4)} is now ${newStatus.toUpperCase()}.`,
      type: 'security'
    });

    await logAudit(req, 'CARD_STATUS_CHANGE', 'Card', card._id, `Card ending in ${card.cardNumber.slice(-4)} changed to ${newStatus}`);

    res.json({ success: true, message: `Card ${newStatus} successfully`, card });
  } catch (err) {
    next(err);
  }
};

exports.setCardPin = async (req, res, next) => {
  try {
    const { pin } = req.body;
    if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
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
      message: `The ATM PIN for your card ending in ${card.cardNumber.slice(-4)} was updated.`,
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
      message: `Your new ${card.cardNetwork} ${card.cardType.toUpperCase()} card has been activated.`,
      type: 'card'
    });

    await logAudit(req, 'REQUEST_CARD', 'Card', card._id, `Requested new ${card.cardType} card`);

    res.status(201).json({ success: true, message: 'Card issued successfully', card });
  } catch (err) {
    next(err);
  }
};
