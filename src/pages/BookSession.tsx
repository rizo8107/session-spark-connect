
import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';

const BookSession = () => {
  const { expertId, sessionId } = useParams();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Book Session</h1>
        <p>Booking flow for expert {expertId}, session {sessionId} coming soon...</p>
      </div>
    </div>
  );
};

export default BookSession;
