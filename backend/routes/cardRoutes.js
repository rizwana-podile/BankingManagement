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
