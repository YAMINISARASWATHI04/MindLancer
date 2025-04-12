// Application.js
const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    resume: { type: String },
    jobId: { type: String },
    jobTitle: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Application', applicationSchema);
