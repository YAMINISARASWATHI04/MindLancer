const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 4
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    postedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    budget: {
        type: Number,
        required: true,
        min: 0
    },
    deadline: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['open', 'in progress', 'completed'],
        default: 'open'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Job', jobSchema);
