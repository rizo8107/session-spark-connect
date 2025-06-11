
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import { Calendar } from '@/components/ui/calendar';
import { ArrowLeft, Clock, DollarSign } from 'lucide-react';

const BookSession = () => {
  const { expertId, sessionId } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Mock data - replace with actual API calls
  const expert = {
    id: expertId,
    name: 'Dr. Sarah Johnson',
    title: 'Product Management Expert',
    avatar: '/placeholder.svg?height=150&width=150'
  };

  const session = {
    id: sessionId,
    title: '1:1 Product Strategy Session',
    duration: 60,
    price: 150,
    description: 'Deep dive into your product strategy, roadmap planning, and growth tactics.'
  };

  const getAvailableSlots = (date: Date) => {
    const slots = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    return slots;
  };

  const handleBookSession = () => {
    if (!selectedDate || !selectedTimeSlot) {
      alert('Please select a date and time slot');
      return;
    }
    setShowBookingForm(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingForm(false);
    navigate('/dashboard');
  };

  if (showBookingForm) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <BookingForm
            expert={expert}
            selectedDate={selectedDate}
            selectedTimeSlot={selectedTimeSlot}
            onSuccess={handleBookingSuccess}
            onCancel={() => setShowBookingForm(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Button 
            variant="ghost" 
            onClick={() => navigate(`/expert/${expertId}`)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expert Profile
          </Button>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Session Details */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Book Your Session</CardTitle>
                  <CardDescription>Select your preferred date and time</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">{session.title}</h3>
                    <p className="text-muted-foreground mb-4">{session.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {session.duration} minutes
                      </div>
                      <div className="flex items-center gap-1">
                        <DollarSign className="h-4 w-4" />
                        ${session.price}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">With {expert.name}</h4>
                    <p className="text-sm text-muted-foreground">{expert.title}</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Date & Time Selection */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Select Date & Time</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                  
                  {selectedDate && (
                    <div>
                      <h4 className="font-medium mb-3">Available Times</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {getAvailableSlots(selectedDate).map((slot) => (
                          <Button
                            key={slot}
                            variant={selectedTimeSlot === slot ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedTimeSlot(slot)}
                            className="text-xs"
                          >
                            {slot}
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedDate && selectedTimeSlot && (
                    <div className="p-3 bg-accent rounded-lg text-sm">
                      <strong>Selected:</strong><br />
                      {selectedDate.toDateString()}<br />
                      at {selectedTimeSlot}
                    </div>
                  )}

                  <Button 
                    onClick={handleBookSession} 
                    className="w-full" 
                    size="lg"
                    disabled={!selectedDate || !selectedTimeSlot}
                  >
                    Continue to Booking
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookSession;
