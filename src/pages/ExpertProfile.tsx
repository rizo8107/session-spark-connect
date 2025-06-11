
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Calendar } from '@/components/ui/calendar';
import Header from '@/components/Header';
import BookingForm from '@/components/BookingForm';
import { Star, MapPin, Clock, DollarSign, Users, Video, Calendar as CalendarIcon } from 'lucide-react';

const ExpertProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  // Mock expert data - replace with actual API call
  const expert = {
    id: '1',
    name: 'Dr. Sarah Johnson',
    title: 'Product Management Expert',
    avatar: '/placeholder.svg?height=150&width=150',
    rating: 4.9,
    reviews: 127,
    sessionsCompleted: 350,
    responseTime: '2 hours',
    languages: ['English', 'Spanish'],
    timezone: 'PST (UTC-8)',
    location: 'San Francisco, CA',
    bio: 'Former VP of Product at major tech companies with 10+ years of experience scaling products from 0 to millions of users. I specialize in product strategy, team leadership, and user research methodologies.',
    experience: '10+ years in Product Management',
    specialties: ['Product Strategy', 'Team Leadership', 'User Research', 'Agile Methodologies', 'Data Analytics'],
    education: 'MBA from Stanford, BS Computer Science from MIT',
    sessions: [
      {
        id: '1',
        title: '1:1 Product Strategy Session',
        duration: 60,
        price: 150,
        description: 'Deep dive into your product strategy, roadmap planning, and growth tactics.',
        type: 'video'
      },
      {
        id: '2',
        title: 'Quick Product Review',
        duration: 30,
        price: 75,
        description: 'Quick feedback on your product, features, or user experience.',
        type: 'video'
      },
      {
        id: '3',
        title: 'Career Guidance in Product',
        duration: 45,
        price: 100,
        description: 'Career advice for aspiring or current product managers.',
        type: 'video'
      }
    ]
  };

  // Mock available time slots for selected date
  const getAvailableSlots = (date: Date) => {
    const slots = [
      '09:00 AM', '10:00 AM', '11:00 AM',
      '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'
    ];
    return slots;
  };

  const handleBookSession = (sessionId: string) => {
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
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Expert Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar className="w-32 h-32">
                    <AvatarImage src={expert.avatar} alt={expert.name} />
                    <AvatarFallback className="text-2xl">
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-4">
                    <div>
                      <h1 className="text-3xl font-bold">{expert.name}</h1>
                      <p className="text-xl text-primary font-medium">{expert.title}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{expert.rating}</span>
                        <span>({expert.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{expert.sessionsCompleted} sessions</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Responds in {expert.responseTime}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{expert.location}</span>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {expert.specialties.slice(0, 4).map((specialty, index) => (
                        <Badge key={index} variant="secondary">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">{expert.bio}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">Experience</h4>
                    <p className="text-sm text-muted-foreground">{expert.experience}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Education</h4>
                    <p className="text-sm text-muted-foreground">{expert.education}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Languages</h4>
                    <p className="text-sm text-muted-foreground">{expert.languages.join(', ')}</p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Timezone</h4>
                    <p className="text-sm text-muted-foreground">{expert.timezone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Available Sessions</CardTitle>
                <CardDescription>Choose the session type that best fits your needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {expert.sessions.map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{session.title}</h3>
                        <p className="text-muted-foreground text-sm">{session.description}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">${session.price}</div>
                        <div className="text-sm text-muted-foreground">{session.duration} min</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Video className="h-4 w-4" />
                        <span>Video call</span>
                        <Clock className="h-4 w-4 ml-2" />
                        <span>{session.duration} minutes</span>
                      </div>
                      
                      <Button onClick={() => handleBookSession(session.id)}>
                        Book Session
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Select Date & Time
                </CardTitle>
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
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpertProfile;
