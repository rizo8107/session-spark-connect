
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        <p>Welcome {user?.name}! Admin dashboard features coming soon...</p>
      </div>
    </div>
  );
};

export default AdminDashboard;
