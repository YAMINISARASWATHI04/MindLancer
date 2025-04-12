// routes/userRoutes.js

const express = require('express');
const router = express.Router();

const { getProfile, getAllUsers } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');

router.get('/profile', protect, getProfile);      // For logged-in users
router.get('/', protect, isAdmin, getAllUsers);   // For admin only

module.exports = router;
