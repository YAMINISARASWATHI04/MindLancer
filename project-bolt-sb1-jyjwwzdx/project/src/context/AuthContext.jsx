import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

// Hardcoded admin accounts
const ADMIN_ACCOUNTS = [
  {
    email: 'pavithramanchikatla@gmail.com',
    password: 'Admin@123',
    role: 'admin',
    adminID: 'ADM-ADMIN1',
    name: 'Primary Admin',
    createdAt: new Date('2023-01-01').toISOString(),
    status: 'active'
  },
  {
    email: 'yaminisaraswathi72@gmail.com',
    password: 'Admin@456',
    role: 'admin',
    adminID: 'ADM-ADMIN2',
    name: 'Secondary Admin',
    createdAt: new Date('2023-01-01').toISOString(),
    status: 'active'
  },
  {
    email: 'buttivaishnavi19@gmail.com',
    password: 'Admin@789',
    role: 'admin',
    adminID: 'ADM-ADMIN3',
    name: 'Tertiary Admin',
    createdAt: new Date('2023-01-01').toISOString(),
    status: 'active'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const signUp = async (email, password, role, additionalData = {}) => {
    try {
      // Prevent admin signups
      if (role === 'admin') {
        throw new Error('Admin accounts cannot be created');
      }
      
      // In a real app, this would make an API call
      const userData = { 
        email, 
        role,
        ...(role === 'freelancer' ? {
          name: additionalData.name,
          mobile: additionalData.mobile,
          skills: additionalData.skills,
          projects: additionalData.projects,
          education: additionalData.education,
          interests: additionalData.interests,
          resume: additionalData.resume?.name || null
        } : role === 'business' ? {
          companyName: additionalData.companyName,
          companyType: additionalData.companyType,
          address: additionalData.address,
          companyAim: additionalData.companyAim,
          position: additionalData.position,
          contactPerson: additionalData.contactPerson,
          linkedin: additionalData.linkedin,
          salary: additionalData.salary,
          jobType: additionalData.jobType,
          requiredSkills: additionalData.requiredSkills
        } : role === 'admin' ? {
          adminID: `ADM-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          createdAt: new Date().toISOString(),
          status: 'active'
        } : {
          createdAt: new Date().toISOString(),
          status: 'pending'
        })
      };
      
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      toast.success('Sign up successful!');
      navigate(role === 'admin' ? '/admin' : 
              role === 'freelancer' ? '/freelancer-dashboard' : '/business-dashboard');
    } catch (error) {
      toast.error('Sign up failed. Please try again.');
    }
  };

  const login = async (email, password) => {
    try {
      // Check if it's a hardcoded admin account
      const adminAccount = ADMIN_ACCOUNTS.find(
        admin => admin.email === email && admin.password === password
      );
      
      if (adminAccount) {
        localStorage.setItem('user', JSON.stringify(adminAccount));
        setUser(adminAccount);
        toast.success('Admin login successful!');
        navigate('/admin');
        return;
      }

      // For non-admin users (existing logic)
      localStorage.setItem('user', JSON.stringify({email, role: 'user'}));
      setUser({email, role: 'user'});
      toast.success('Login successful!');
      navigate('/dashboard');
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
    toast.info('Logged out successfully');
  };

  const value = {
    user,
    signUp,
    login,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};