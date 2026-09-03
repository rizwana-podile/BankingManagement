const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile, changePassword, toggleTwoFactor } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.put('/toggle-2fa', protect, toggleTwoFactor);

module.exports = router;
