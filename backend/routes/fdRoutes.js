const express = require('express');
const router = express.Router();
const { getMyFDs, createFD, breakFD } = require('../controllers/fdController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getMyFDs);
router.post('/', createFD);
router.put('/:id/break', breakFD);

module.exports = router;
