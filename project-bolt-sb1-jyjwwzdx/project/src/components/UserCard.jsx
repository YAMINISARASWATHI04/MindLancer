import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Briefcase } from 'lucide-react';

function UserCard({ user }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={user.avatar || 'https://via.placeholder.com/100'}
          alt={`${user.name}'s avatar`}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div>
          <h3 className="text-xl font-semibold text-gray-900">
            <Link to={`/profile/${user.id}`} className="hover:text-blue-600">
              {user.name}
            </Link>
          </h3>
          <p className="text-gray-600">{user.title}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
        <MapPin className="w-4 h-4" />
        {user.location}
        <span className="mx-2">•</span>
        <Star className="w-4 h-4 text-yellow-400" />
        {user.rating} ({user.reviewCount} reviews)
        <span className="mx-2">•</span>
        <Briefcase className="w-4 h-4" />
        {user.jobsCompleted} jobs completed
      </div>

      <p className="text-gray-600 mb-4 line-clamp-2">{user.bio}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {user.skills.map((skill) => (
          <span
            key={skill}
            className="bg-gray-100 text-gray-800 text-sm px-3 py-1 rounded-full"
          >
            {skill}
          </span>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-gray-900">
          ${user.hourlyRate}/hr
        </span>
        <Link
          to={`/profile/${user.id}`}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
        >
          View Profile
        </Link>
      </div>
    </div>
  );
}

export default UserCard;