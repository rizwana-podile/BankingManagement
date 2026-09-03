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

// 1. authRoutes.js
writeFile(path.join(backendDir, 'routes', 'authRoutes.js'), `
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
`);

// 2. accountRoutes.js
writeFile(path.join(backendDir, 'routes', 'accountRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getMyAccounts, getAccountDetails, getMiniStatement } = require('../controllers/accountController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyAccounts);
router.get('/:id', getAccountDetails);
router.get('/:id/mini-statement', getMiniStatement);

module.exports = router;
`);

// 3. transferRoutes.js
writeFile(path.join(backendDir, 'routes', 'transferRoutes.js'), `
const express = require('express');
const router = express.Router();
const { transferFunds, getTransactions, getReceipt } = require('../controllers/transferController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.post('/', transferFunds);
router.get('/', getTransactions);
router.get('/receipt/:id', getReceipt);

module.exports = router;
`);

// 4. beneficiaryRoutes.js
writeFile(path.join(backendDir, 'routes', 'beneficiaryRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getBeneficiaries, addBeneficiary, deleteBeneficiary, validateAccount } = require('../controllers/beneficiaryController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getBeneficiaries);
router.post('/', addBeneficiary);
router.delete('/:id', deleteBeneficiary);
router.post('/validate', validateAccount);

module.exports = router;
`);

// 5. cardRoutes.js
writeFile(path.join(backendDir, 'routes', 'cardRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getMyCards, toggleBlockCard, setCardPin, updateLimits, requestCard } = require('../controllers/cardController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyCards);
router.post('/request', requestCard);
router.put('/:id/toggle-block', toggleBlockCard);
router.put('/:id/set-pin', setCardPin);
router.put('/:id/limits', updateLimits);

module.exports = router;
`);

// 6. loanRoutes.js
writeFile(path.join(backendDir, 'routes', 'loanRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getMyLoans, applyLoan, repayEmi } = require('../controllers/loanController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyLoans);
router.post('/apply', applyLoan);
router.post('/:id/repay-emi', repayEmi);

module.exports = router;
`);

// 7. fdRoutes.js
writeFile(path.join(backendDir, 'routes', 'fdRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getMyFDs, createFD, breakFD } = require('../controllers/fdController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyFDs);
router.post('/', createFD);
router.put('/:id/break', breakFD);

module.exports = router;
`);

// 8. billRoutes.js
writeFile(path.join(backendDir, 'routes', 'billRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getBillHistory, payBill } = require('../controllers/billController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getBillHistory);
router.post('/pay', payBill);

module.exports = router;
`);

// 9. notificationRoutes.js
writeFile(path.join(backendDir, 'routes', 'notificationRoutes.js'), `
const express = require('express');
const router = express.Router();
const { getNotifications, markAsRead, markAllAsRead, deleteNotification } = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getNotifications);
router.put('/mark-all-read', markAllAsRead);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

module.exports = router;
`);

// 10. staffRoutes.js
writeFile(path.join(backendDir, 'routes', 'staffRoutes.js'), `
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
`);

// 11. adminRoutes.js
writeFile(path.join(backendDir, 'routes', 'adminRoutes.js'), `
const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getUsers,
  createUser,
  updateUser,
  resetUserPassword,
  getBranches,
  createBranch,
  updateBranch,
  deleteBranch,
  broadcastNotification,
  getAuditLogs,
  getReports
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.put('/users/:id/reset-password', resetUserPassword);

router.get('/branches', getBranches);
router.post('/branches', createBranch);
router.put('/branches/:id', updateBranch);
router.delete('/branches/:id', deleteBranch);

router.post('/broadcast', broadcastNotification);
router.get('/audit-logs', getAuditLogs);
router.get('/reports', getReports);

module.exports = router;
`);

console.log('All 11 route files created successfully!');