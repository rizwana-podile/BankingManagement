const express = require('express');
const router = express.Router();
const { transferFunds, getTransactions, getReceipt } = require('../controllers/transferController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', transferFunds);
router.get('/', getTransactions);
router.get('/receipt/:id', getReceipt);

module.exports = router;
