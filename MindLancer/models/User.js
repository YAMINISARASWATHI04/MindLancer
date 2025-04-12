const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.role === 'freelancer';
        },
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    role: {
        type: String,
        enum: ['freelancer', 'business', 'admin'],
        required: true,
    },

    // Freelancer-specific fields
    mobile: String,
    skills: [String],
    projects: [String],
    education: [String],
    interests: [String],
    resume: String,

    // Business-specific fields
    companyName: String,
    companyType: String,
    address: String,
    companyAim: String,
    position: String,
    contactPerson: String,
    linkedin: String,
    salary: String,
    jobType: String,
    requiredSkills: [String],

    // Admin-specific fields
    adminID: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'blocked'],
        default: 'pending',
    },
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

module.exports = mongoose.model('User', userSchema);
