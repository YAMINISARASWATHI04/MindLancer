import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Pages
import AdminPanel from '../pages/AdminPanel';
import BusinessDashboard from '../pages/BusinessDashboard';
import FreelancerDashboard from '../pages/FreelancerDashboard';
import HomePage from '../pages/HomePage';
import JobPostPage from '../pages/JobPostPage';
import JobsFromJSON from '../pages/jobs';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import UploadResume from '../pages/resume';
import ResumeForm from '../pages/ResumeForm';
import SignUpPage from '../pages/SignUpPage';
import JobRecommender from '../pages/JobRecommender';

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
      <Route path="/business-dashboard" element={<BusinessDashboard />} />
      <Route path="/admin" element={<AdminPanel />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/post-job" element={<JobPostPage />} />
      <Route path="/jobs" element={<JobsFromJSON />} />
      <Route path="/upload" element={<UploadResume />} />
      <Route path="/resume" element={<ResumeForm />} />
      <Route path="/smartjob" element={<JobRecommender />} />


      {/* Catch all route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
