const express = require('express');
const router = express.Router();
const {
  getStaffOverview,
  getCustomers,
  getCustomerDetails,
  updateCustomerStatus,
  openCustomerAccount,
  freezeAccount,
  getKYCQueue,
  reviewKYC,
  getLoanQueue,
  reviewLoan,
  disburseLoan,
  getTransactionsMonitoring,
  flagTransaction
} = require('../controllers/staffController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('employee', 'admin'));

router.get('/overview', getStaffOverview);
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerDetails);
router.put('/customers/:id/status', updateCustomerStatus);
router.post('/accounts/open', openCustomerAccount);
router.put('/accounts/:id/freeze', freezeAccount);

router.get('/kyc', getKYCQueue);
router.put('/kyc/:id/review', reviewKYC);

router.get('/loans', getLoanQueue);
router.put('/loans/:id/review', reviewLoan);
router.post('/loans/:id/disburse', disburseLoan);

router.get('/transactions', getTransactionsMonitoring);
router.put('/transactions/:id/flag', flagTransaction);

module.exports = router;
