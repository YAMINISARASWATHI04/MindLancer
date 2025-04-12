const mongoose = require('mongoose');

const proposalSchema = new mongoose.Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    contact: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    education: {
        type: String,
        required: true,
    },
    resume: {
        type: String, // File path
        required: true,
    },
    bidAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true });

module.exports = mongoose.model('Proposal', proposalSchema);
