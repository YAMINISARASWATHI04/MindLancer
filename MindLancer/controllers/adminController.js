const User = require('../models/User');
const Job = require('../models/Job');
const Proposal = require('../models/Proposal');

// GET all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching users' });
    }
};

// DELETE a user by ID
exports.deleteUser = async (req, res) => {
    try {
        const deleted = await User.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'User not found' });
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting user' });
    }
};

// GET all jobs
exports.getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find();
        res.status(200).json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching jobs' });
    }
};

// DELETE a job by ID
exports.deleteJob = async (req, res) => {
    try {
        const deleted = await Job.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: 'Job not found' });
        res.status(200).json({ message: 'Job deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting job' });
    }
};

// GET flagged proposals (optional for disputes)
exports.getFlaggedProposals = async (req, res) => {
    try {
        const flagged = await Proposal.find({ isFlagged: true });
        res.status(200).json(flagged);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching flagged proposals' });
    }
};
