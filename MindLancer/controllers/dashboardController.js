const Job = require('../models/Job');
const Payment = require('../models/Payment');
const Activity = require('../models/Activity');

const getDashboardData = async (req, res) => {
  const { userId } = req.params;

  try {
    // Fetch job stats
    const [completedJobs, ongoingJobs] = await Promise.all([
      Job.find({ user: userId, status: 'completed' }),
      Job.find({ user: userId, status: 'ongoing' })
    ]);

    // Calculate total earnings
    const earningsResult = await Payment.aggregate([
      { $match: { user: userId } },
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const totalEarnings = earningsResult.length > 0 ? earningsResult[0].total : 0;

    // Get recent activity
    const recentActivity = await Activity.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(5);

    // Respond with dashboard data
    res.status(200).json({
      completedJobs: completedJobs.length,
      ongoingJobs: ongoingJobs.length,
      earnings: totalEarnings,
      recentActivity
    });
  } catch (err) {
    console.error('Error fetching dashboard data:', err);
    res.status(500).json({ message: 'Failed to fetch dashboard data', error: err.message });
  }
};

module.exports = { getDashboardData };
