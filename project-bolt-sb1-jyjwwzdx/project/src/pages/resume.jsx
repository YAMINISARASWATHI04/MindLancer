import axios from 'axios';
import React, { useState } from 'react';

const UploadResume = () => {
    const [file, setFile] = useState(null);
    const [jdText, setJdText] = useState('');
    const [response, setResponse] = useState(null);
    const [error, setError] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleTextChange = (e) => {
        setJdText(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file || !jdText) {
            alert('Please provide both resume file and job description');
            return;
        }

        const formData = new FormData();
        formData.append('file', file);
        formData.append('jd_text', jdText);

        try {
            const res = await axios.post('http://127.0.0.1:8080/upload-resume/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setResponse(res.data);
            setError(null);
        } catch (err) {
            setError('Failed to upload resume. Please check the API and try again.');
            setResponse(null);
        }
    };

    return (
        <div className="p-4 max-w-xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Upload Resume for ATS Scoring</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Resume (PDF):</label>
                    <input type="file" accept=".pdf" onChange={handleFileChange} required />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Job Description:</label>
                    <textarea
                        className="w-full border p-2 rounded"
                        value={jdText}
                        onChange={handleTextChange}
                        rows={4}
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                >
                    Upload
                </button>
            </form>

            {response && (
                <div className="mt-6 bg-green-100 p-4 rounded">
                    <h3 className="font-semibold text-green-800">Response:</h3>
                    <pre className="whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}

            {error && (
                <div className="mt-6 bg-red-100 p-4 rounded">
                    <h3 className="font-semibold text-red-800">Error:</h3>
                    <p>{error}</p>
                </div>
            )}
        </div>
    );
};

export default UploadResume;
