import axios from "axios";
import React, { useState } from "react";

const ResumeForm = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        objective: "",
        education: [{ degree: "", institute: "", year: "", grade: "" }],
        skills: "",
        projects: [{ title: "", description: "" }],
        certifications: "",
        activities: "",
    });

    const handleChange = (e, index, section) => {
        const { name, value } = e.target;
        if (section) {
            const updatedSection = [...formData[section]];
            updatedSection[index][name] = value;
            setFormData({ ...formData, [section]: updatedSection });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const addRow = (section, emptyObj) => {
        setFormData({ ...formData, [section]: [...formData[section], emptyObj] });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Format data to match backend expectations
        const formattedData = {
            ...formData,
            skills: formData.skills.split(",").map((s) => s.trim()),
            certifications: formData.certifications.split(",").map((c) => c.trim()),
            activities: formData.activities.split(",").map((a) => a.trim()),
            education: formData.education.map((e) => [e.degree, e.institute, e.year, e.grade]),
            projects: formData.projects.map((p) => [p.title, p.description]),
        };

        try {
            const response = await axios.post("http://127.0.0.1:8008/generate-resume", formattedData, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `${formData.name}_resume.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Error generating resume:", error);
            alert("Failed to generate resume. Please check your input.");
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md mt-6">
            <h2 className="text-2xl font-bold mb-4 text-center">Resume Generator</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Info */}
                {["name", "email", "phone", "address", "objective"].map((field) => (
                    <input
                        key={field}
                        type="text"
                        name={field}
                        placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                ))}

                {/* Education Section */}
                <div>
                    <h3 className="font-semibold">Education</h3>
                    {formData.education.map((edu, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-2 my-2">
                            {["degree", "institute", "year", "grade"].map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    name={field}
                                    placeholder={field}
                                    value={edu[field]}
                                    onChange={(e) => handleChange(e, idx, "education")}
                                    className="p-2 border border-gray-300 rounded"
                                    required
                                />
                            ))}
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-blue-500 underline"
                        onClick={() => addRow("education", { degree: "", institute: "", year: "", grade: "" })}
                    >
                        + Add Education
                    </button>
                </div>

                {/* Projects */}
                <div>
                    <h3 className="font-semibold">Projects</h3>
                    {formData.projects.map((proj, idx) => (
                        <div key={idx} className="grid grid-cols-2 gap-2 my-2">
                            {["title", "description"].map((field) => (
                                <input
                                    key={field}
                                    type="text"
                                    name={field}
                                    placeholder={field}
                                    value={proj[field]}
                                    onChange={(e) => handleChange(e, idx, "projects")}
                                    className="p-2 border border-gray-300 rounded"
                                    required
                                />
                            ))}
                        </div>
                    ))}
                    <button
                        type="button"
                        className="text-blue-500 underline"
                        onClick={() => addRow("projects", { title: "", description: "" })}
                    >
                        + Add Project
                    </button>
                </div>

                {/* Other Sections */}
                {["skills", "certifications", "activities"].map((field) => (
                    <textarea
                        key={field}
                        name={field}
                        placeholder={`${field} (comma-separated)`}
                        value={formData[field]}
                        onChange={handleChange}
                        className="w-full p-2 border border-gray-300 rounded"
                        rows={2}
                        required
                    />
                ))}

                <button
                    type="submit"
                    className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                    Generate Resume
                </button>
            </form>
        </div>
    );
};

export default ResumeForm;
