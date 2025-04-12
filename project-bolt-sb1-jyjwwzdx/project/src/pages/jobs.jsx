import React, { useEffect, useState } from 'react';

function Jobs() {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedJob, setSelectedJob] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        resume: null,
    });
    const [submitMsg, setSubmitMsg] = useState('');

    useEffect(() => {
        fetch('/jobs.json')
            .then((res) => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.json();
            })
            .then((data) => {
                setJobs(data);
                setFilteredJobs(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error('Failed to load jobs.json', err);
                setError('Failed to load job listings.');
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        const term = searchTerm.toLowerCase();
        const filtered = jobs.filter((job) => {
            const titleMatch = job.title?.toLowerCase().includes(term);
            const skillsMatch = job.skills?.some(skill => skill.toLowerCase().includes(term));
            return titleMatch || skillsMatch;
        });
        setFilteredJobs(filtered);
    }, [searchTerm, jobs]);

    const handleApplyClick = (job) => {
        setSelectedJob(job);
        setShowModal(true);
        setFormData({ name: '', email: '', resume: null });
        setSubmitMsg('');
    };

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'resume') {
            setFormData((prev) => ({ ...prev, resume: files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formPayload = new FormData();
        formPayload.append('name', formData.name);
        formPayload.append('email', formData.email);
        formPayload.append('resume', formData.resume);
        formPayload.append('jobId', selectedJob?.id || selectedJob?._id || '');
        formPayload.append('jobTitle', selectedJob?.title || '');

        try {
            const response = await fetch('http://localhost:5000/api/apply_jobs', {
                method: 'POST',
                body: formPayload
            });

            if (!response.ok) throw new Error('Failed to submit application');

            setSubmitMsg('Application submitted successfully!');
            setFormData({ name: '', email: '', resume: null });

            setTimeout(() => setShowModal(false), 1500);
        } catch (err) {
            console.error(err);
            setSubmitMsg('Failed to submit. Try again.');
        }
    };

    if (loading) return <div className="p-6 text-xl">Loading job listings...</div>;
    if (error) return <div className="p-6 text-red-600">{error}</div>;

    return (
        <div className="p-6 relative">
            {/* Search Bar */}
            <div className="absolute top-6 right-6">
                <input
                    type="text"
                    placeholder="Search by title or skills..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="border border-gray-300 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <h1 className="text-3xl font-bold mb-4">Freelance Job Listings</h1>

            {filteredJobs.length === 0 && (
                <p className="text-gray-500 mt-6">No jobs match your search.</p>
            )}

            {filteredJobs.map((job, index) => (
                <div key={job.id || job._id || index} className="border p-4 rounded-lg shadow mb-6">
                    <a
                        href={job.url || '#'}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xl font-semibold text-blue-600 hover:underline"
                    >
                        {job.title || 'Untitled Job'}
                    </a>
                    <p className="mt-2 text-gray-700 whitespace-pre-line">{job.description || 'No description available.'}</p>
                    {job.skills && job.skills.length > 0 && (
                        <div className="mt-3">
                            <strong>Skills Required:</strong>
                            <ul className="list-disc ml-5 text-sm text-gray-800">
                                {job.skills.map((skill, i) => (
                                    <li key={i}>{skill}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                    <p className="mt-3 font-medium text-green-700">{job.budget || 'No budget specified'}</p>
                    <button
                        onClick={() => handleApplyClick(job)}
                        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Apply Now
                    </button>
                </div>
            ))}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-2xl"
                            onClick={() => setShowModal(false)}
                        >
                            ×
                        </button>
                        <h2 className="text-xl font-bold mb-4">Apply for: {selectedJob?.title}</h2>
                        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
                            <input
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                            <input
                                type="file"
                                name="resume"
                                accept=".pdf,.doc,.docx"
                                onChange={handleChange}
                                required
                                className="w-full p-2 border rounded"
                            />
                            <button
                                type="submit"
                                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                                Submit Application
                            </button>
                        </form>
                        {submitMsg && (
                            <p className={`mt-3 text-sm ${submitMsg.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                                {submitMsg}
                            </p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Jobs;
