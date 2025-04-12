const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// Create uploads directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Middleware setup
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(uploadDir));

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));

// === Mongoose Schemas ===

// Job Posting Schema
const JobSchema = new mongoose.Schema({
    title: String,
    description: String,
    skills: [String],
    budget: String,
    lastDate: String,
    email: String, // Email of the job poster
}, { timestamps: true });

const Job = mongoose.model('Bussiness_jobs', JobSchema);

// Application Schema
const ApplicationSchema = new mongoose.Schema({
    name: String,
    email: String,
    resume: String,
    jobId: String,
    jobTitle: String
});

const Application = mongoose.model('Application', ApplicationSchema);

// === Multer Setup for Resume Upload ===
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});

const upload = multer({ storage });

// === Routes ===

// Route to apply to a job (with resume file)
app.post('/api/apply_jobs', upload.single('resume'), async (req, res) => {
    const { name, email, jobId, jobTitle } = req.body;

    if (!name || !email || !req.file) {
        return res.status(400).json({ message: 'All fields including resume are required' });
    }

    try {
        const newApp = new Application({
            name,
            email,
            resume: req.file.path,
            jobId,
            jobTitle
        });

        await newApp.save();
        res.status(201).json({ message: 'Application submitted successfully' });
    } catch (error) {
        console.error('Application error:', error);
        res.status(500).json({ message: 'Server error. Try again later.' });
    }
});

// Route to post a new job
app.post('/api/bussi_jobs', async (req, res) => {
    try {
        const job = new Job(req.body);
        await job.save();
        res.status(201).json({ message: 'Job posted successfully' });
    } catch (error) {
        console.error('Error posting job:', error);
        res.status(500).json({ message: 'Failed to post job' });
    }
});

// Get active jobs by email
app.get('/api/bussi_jobs/:email', async (req, res) => {
    const userEmail = req.params.email;
    const today = new Date().toISOString().split('T')[0];

    try {
        const jobs = await Job.find({
            email: userEmail,
            lastDate: { $gte: today } // only active jobs
        });
        res.json(jobs);
    } catch (error) {
        console.error('Error fetching jobs:', error);
        res.status(500).json({ message: 'Error fetching jobs' });
    }
});

// Job count by email
app.get('/api/bussi_jobs/count/:email', async (req, res) => {
    const email = req.params.email;
    const today = new Date().toISOString().split('T')[0];

    try {
        const count = await Job.countDocuments({
            email,
            lastDate: { $gte: today }
        });
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching job count' });
    }
});

// Application count by job poster email
app.get('/api/applications/count/:email', async (req, res) => {
    const email = req.params.email;

    try {
        const count = await Job.countDocuments({
            email: email
        });
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error fetching application count' });
    }
});

// Search jobs by title or skill
app.get('/api/search_jobs', async (req, res) => {
    const { query } = req.query;

    if (!query) return res.status(400).json({ message: 'Query is required' });

    try {
        const jobs = await Job.find({
            $or: [
                { title: { $regex: query, $options: 'i' } },
                { skills: { $elemMatch: { $regex: query, $options: 'i' } } }
            ]
        });
        res.json(jobs);
    } catch (error) {
        console.error('Error searching jobs:', error);
        res.status(500).json({ message: 'Error searching jobs' });
    }
});

// === Start Server ===
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
