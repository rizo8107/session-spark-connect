
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';

const ExpertProfile = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Expert Profile</h1>
        <p>Expert profile for ID: {id} coming soon...</p>
      </div>
    </div>
  );
};

export default ExpertProfile;
