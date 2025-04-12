import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) return setLoading(false);

    const fetchUserProfile = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/auth/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }

        const data = await res.json();
        setUser(data.user); // Assuming your backend sends { user: { ... } }
      } catch (err) {
        console.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  if (!localStorage.getItem('token')) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md w-full">
        <h1 className="text-2xl font-bold mb-4 text-center">User Profile</h1>
        {loading ? (
          <p>Loading...</p>
        ) : user ? (
          <div className="space-y-2">
            <p><span className="font-semibold">Name:</span> {user.name}</p>
            <p><span className="font-semibold">Email:</span> {user.email}</p>
            <p><span className="font-semibold">Role:</span> {user.role}</p>
          </div>
        ) : (
          <p className="text-red-600">Could not load user data.</p>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
