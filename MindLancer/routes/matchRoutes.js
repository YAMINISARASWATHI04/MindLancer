const express = require('express');
const router = express.Router();
const { matchJobToFreelancer } = require('../controllers/matchController');
const { protect } = require('../middleware/authMiddleware');

router.post('/recommend', protect, matchJobToFreelancer);

module.exports = router;
