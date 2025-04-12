import { Briefcase } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

function DashboardPage() {
  const { user } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    completedJobs: 0,
    ongoingJobs: 0,
    earnings: 0,
    recentActivity: []
  });

  useEffect(() => {
    if (!user?._id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/dashboard/${user._id}`);
        const data = await res.json();
        setDashboardData(data);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* header ... */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar ... */}
          <div className="md:col-span-3 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">Welcome back, {user?.name || 'User'}!</h2>
              <p className="text-gray-600 mb-4">
                {user?.role === 'freelancer'
                  ? 'Check your latest job matches and applications.'
                  : 'Manage your posted jobs and find talented freelancers.'}
              </p>
              <div className="flex space-x-4">
                <div className="bg-blue-50 p-4 rounded-lg flex-1">
                  <h3 className="font-medium text-gray-700">Completed Jobs</h3>
                  <p className="text-2xl font-bold">{dashboardData.completedJobs}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg flex-1">
                  <h3 className="font-medium text-gray-700">Ongoing</h3>
                  <p className="text-2xl font-bold">{dashboardData.ongoingJobs}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg flex-1">
                  <h3 className="font-medium text-gray-700">Earnings</h3>
                  <p className="text-2xl font-bold">${dashboardData.earnings}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
              <div className="space-y-4">
                {dashboardData.recentActivity.map((item, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="mt-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <Briefcase className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                      <p className="text-xs text-gray-400">{new Date(item.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;
