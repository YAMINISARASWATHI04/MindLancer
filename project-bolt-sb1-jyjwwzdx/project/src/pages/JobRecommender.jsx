import axios from "axios";
import React, { useState } from "react";

const JobRecommender = () => {
    const [resume, setResume] = useState(null);
    const [jobsJson, setJobsJson] = useState(null);
    const [topJobs, setTopJobs] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!resume || !jobsJson) {
            alert("Upload both resume and jobs JSON");
            return;
        }

        const formData = new FormData();
        formData.append("resume", resume);
        formData.append("jobs_json", jobsJson);

        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8005/recommend-jobs/?top_n=8",
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            setTopJobs(response.data.top_jobs);
        } catch (err) {
            console.error(err);
            alert("Something went wrong!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Job Recommender</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Upload Resume (PDF)</label>
                    <input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => setResume(e.target.files[0])}
                        className="block w-full border p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block font-medium mb-1">Upload Jobs JSON</label>
                    <input
                        type="file"
                        accept="application/json"
                        onChange={(e) => setJobsJson(e.target.files[0])}
                        className="block w-full border p-2 rounded"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                    {loading ? "Fetching..." : "Get Recommendations"}
                </button>
            </form>

            {topJobs.length > 0 && (
                <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Top Matches</h3>
                    <ul className="space-y-4">
                        {topJobs.map((job, index) => (
                            <li
                                key={index}
                                className="p-4 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                <h4 className="font-bold text-lg">{job.title}</h4>
                                <p className="text-sm text-gray-700">{job.budget}</p>
                                <p className="text-sm text-green-600">
                                    Match Score: {(job.match_score * 100).toFixed(2)}%
                                </p>
                                <a
                                    href={job.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-blue-500 underline text-sm"
                                >
                                    View Job
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default JobRecommender;
