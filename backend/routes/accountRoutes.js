const express = require('express');
const router = express.Router();
const { getMyAccounts, getAccountDetails, getMiniStatement } = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyAccounts);
router.get('/:id', getAccountDetails);
router.get('/:id/mini-statement', getMiniStatement);

module.exports = router;
