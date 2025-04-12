import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import useAdminService from '../services/adminService';

function AdminPanel() {
  const { user } = useAuth();
  const { accounts, loading } = useAdminService();

  useEffect(() => {
    // Store all created accounts in localStorage
    if (user && user.createdAt) {
      const storedAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
      if (!storedAccounts.some(acc => acc.email === user.email)) {
        const newAccounts = [...storedAccounts, user];
        localStorage.setItem('accounts', JSON.stringify(newAccounts));
      }
    }
  }, [user]);


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="admin-panel" style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>
      <div className="admin-info" style={{
        background: '#f5f5f5',
        padding: '15px',
        borderRadius: '5px',
        marginBottom: '20px'
      }}>
        <p>Welcome, {user?.name || 'Admin'}!</p>
        {user?.adminID && <p>Your Admin ID: <strong>{user.adminID}</strong></p>}
      </div>

      <div className="accounts-list">
        <h2>Recent Accounts</h2>
        {loading ? (
          <p>Loading accounts...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '10px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Role</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Created</th>
                <th style={{ padding: '10px', textAlign: 'left' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {accounts.slice().reverse().map(account => (
                <tr key={account.email} style={{ borderBottom: '1px solid #ddd' }}>
                  <td style={{ padding: '10px' }}>
                    <button 
                      onClick={() => navigate(`/profile/${account.email}`)}
                      style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer' }}
                    >
                      {account.email}
                    </button>
                  </td>
                  <td style={{ padding: '10px' }}>{account.role}</td>
                  <td style={{ padding: '10px' }}>{formatDate(account.createdAt)}</td>
                  <td style={{ 
                    padding: '10px',
                    color: account.status === 'approved' ? 'green' : 
                          account.status === 'suspended' ? 'orange' : 
                          account.status === 'deactivated' ? 'red' : 'gray'
                  }}>
                    {account.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default AdminPanel;
