import React from 'react';
import JobCard from '../components/JobCard';

function JobListings() {
  return (
    <div className="job-listings">
      <h1>Available Jobs</h1>
      <div className="jobs-container">
        {/* Job cards will be rendered here */}
        <JobCard />
      </div>
    </div>
  );
}

export default JobListings;
