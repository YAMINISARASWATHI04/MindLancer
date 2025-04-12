import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function BusinessDashboard() {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', skills: '', budget: '', lastDate: '' });
  const [showJobs, setShowJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [activeJobsCount, setActiveJobsCount] = useState(0);
  const [applicationCount, setApplicationCount] = useState(0);

  // Fetch job and application counts when component mounts
  useEffect(() => {
    if (user?.email) {
      fetch(`http://localhost:5000/api/bussi_jobs/count/${user.email}`)
        .then(res => res.json())
        .then(data => setActiveJobsCount(data.count))
        .catch(err => console.error('Error fetching active job count:', err));

      fetch(`http://localhost:5000/api/applications/count/${user.email}`)
        .then(res => res.json())
        .then(data => setApplicationCount(data.count))
        .catch(err => console.error('Error fetching application count:', err));
    }
  }, [user?.email]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const jobData = {
      ...formData,
      email: user?.email,
      skills: formData.skills.split(',').map(skill => skill.trim())
    };

    try {
      const response = await fetch('http://localhost:5000/api/bussi_jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(jobData),
      });

      if (response.ok) {
        alert('Job posted successfully!');
        setShowModal(false);
        setFormData({ title: '', description: '', skills: '', budget: '', lastDate: '' });
      } else {
        alert('Failed to post job');
      }
    } catch (error) {
      console.error('Error posting job:', error);
      alert('An error occurred');
    }
  };

  const handleViewJobs = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/bussi_jobs/${user?.email}`);
      const data = await response.json();
      setJobs(data);
      setShowJobs(true);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('Failed to fetch jobs');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Business Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Active Jobs</h3>
            <p className="text-3xl text-blue-600 font-bold">{activeJobsCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Applications</h3>
            <p className="text-3xl text-green-600 font-bold">{applicationCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Hired Freelancers</h3>
            <p className="text-3xl text-purple-600 font-bold">0</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700">
              Post a New Job
            </button>
            <button onClick={handleViewJobs} className="bg-gray-100 text-gray-800 py-2 px-4 rounded hover:bg-gray-200">
              View Applications
            </button>
          </div>
        </div>

        {/* Posting Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg w-full max-w-lg shadow-lg">
              <h2 className="text-2xl font-semibold mb-4">Post a New Job</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <input type="text" name="title" value={formData.title} onChange={handleChange} required placeholder="Title" className="w-full border px-3 py-2 rounded" />
                <textarea name="description" value={formData.description} onChange={handleChange} required rows={4} placeholder="Description" className="w-full border px-3 py-2 rounded" />
                <input type="text" name="skills" value={formData.skills} onChange={handleChange} required placeholder="Skills (comma-separated)" className="w-full border px-3 py-2 rounded" />
                <input type="text" name="budget" value={formData.budget} onChange={handleChange} required placeholder="Budget" className="w-full border px-3 py-2 rounded" />
                <input type="date" name="lastDate" value={formData.lastDate} onChange={handleChange} required className="w-full border px-3 py-2 rounded" />
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Jobs View Modal */}
        {showJobs && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-10 overflow-auto">
            <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-3xl relative">
              <button onClick={() => setShowJobs(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl">&times;</button>
              <h2 className="text-2xl font-bold mb-4">Your Active Job Postings</h2>
              {jobs.length === 0 ? (
                <p className="text-gray-600">No active jobs available.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {jobs.map((job) => (
                    <div key={job._id} className="border p-4 rounded-lg shadow hover:bg-gray-50 transition">
                      <h3 className="text-xl font-semibold text-blue-600">{job.title}</h3>
                      <p className="text-gray-700 mt-1">{job.description}</p>
                      <p className="text-sm text-gray-600 mt-1"><strong>Skills:</strong> {job.skills.join(', ')}</p>
                      <p className="text-sm text-gray-600"><strong>Budget:</strong> ₹{job.budget}</p>
                      <p className="text-sm text-gray-600"><strong>Last Date:</strong> {job.lastDate}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BusinessDashboard;
