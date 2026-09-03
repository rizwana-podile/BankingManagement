const express = require('express');
const router = express.Router();
const { getMyLoans, applyLoan, repayEmi } = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyLoans);
router.post('/apply', applyLoan);
router.post('/:id/repay-emi', repayEmi);

module.exports = router;
