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
