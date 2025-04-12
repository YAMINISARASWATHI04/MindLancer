const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/roleMiddleware');
const {
    getAllUsers,
    deleteUser,
    getAllJobs,
    deleteJob,
    getFlaggedProposals,
} = require('../controllers/adminController');

// All routes require admin access
router.use(protect, isAdmin);

router.get('/users', getAllUsers);
router.delete('/user/:id', deleteUser);

router.get('/jobs', getAllJobs);
router.delete('/job/:id', deleteJob);

router.get('/proposals/flagged', getFlaggedProposals);

module.exports = router;
