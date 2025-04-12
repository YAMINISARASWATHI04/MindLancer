import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, DollarSign } from 'lucide-react';

function JobCard({ job }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            <Link to={`/jobs/${job.id}`} className="hover:text-blue-600">
              {job.title}
            </Link>
          </h3>
          <p className="text-gray-600">{job.company}</p>
        </div>
        {job.logo && (
          <img
            src={job.logo}
            alt={`${job.company} logo`}
            className="w-12 h-12 object-contain"
          />
        )}
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

      <div className="flex flex-wrap gap-4 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          {job.type}
        </div>
        <div className="flex items-center">
          <MapPin className="w-4 h-4 mr-1" />
          {job.location}
        </div>
        <div className="flex items-center">
          <DollarSign className="w-4 h-4 mr-1" />
          {job.salary}
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted {new Date(job.postedAt).toLocaleDateString()}
        </span>
        <Link
          to={`/jobs/${job.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          Apply Now
        </Link>
      </div>
    </div>
  );
}

export default JobCard;