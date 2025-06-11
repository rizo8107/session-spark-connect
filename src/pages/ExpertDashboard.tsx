
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';

const ExpertDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Expert Dashboard</h1>
        <p>Welcome {user?.name}! Expert dashboard features coming soon...</p>
      </div>
    </div>
  );
};

export default ExpertDashboard;
