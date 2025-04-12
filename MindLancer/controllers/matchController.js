const axios = require('axios');

exports.matchJobToFreelancer = async (req, res) => {
    try {
        const { description, userId } = req.body;
        const response = await axios.post('http://localhost:5001/match', { description, userId });

        res.json(response.data);
    } catch (err) {
        res.status(500).json({ message: 'Matching service error' });
    }
};
