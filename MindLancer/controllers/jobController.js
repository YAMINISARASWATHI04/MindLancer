const Job = require('../models/Job');

exports.createJob = async (req, res) => {
    try {
        const job = await Job.create({ ...req.body, postedBy: req.user._id });
        res.status(201).json(job);
    } catch (err) {
        res.status(500).json({ message: 'Error creating job' });
    }
};

exports.getJobs = async (req, res) => {
    try {
        const jobs = await Job.find().populate('postedBy', 'name');
        res.json(jobs);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching jobs' });
    }
};
