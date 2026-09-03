const express = require('express');
const router = express.Router();
const { getBillHistory, payBill } = require('../controllers/billController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getBillHistory);
router.post('/pay', payBill);

module.exports = router;
