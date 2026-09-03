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
