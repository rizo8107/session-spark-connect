
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { Calendar, Clock, Video, User, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Booking {
  id: string;
  expertName: string;
  expertTitle: string;
  date: string;
  time: string;
  sessionType: string;
  price: number;
  meetingLink: string;
  status: string;
  name: string;
  sessionGoals: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage
    const savedBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
    setBookings(savedBookings);
  }, []);

  const isSessionLive = (date: string, time: string) => {
    const sessionDateTime = new Date(`${date} ${time}`);
    const now = new Date();
    const timeDiff = sessionDateTime.getTime() - now.getTime();
    // Consider session live if it's within 15 minutes before to 1 hour after
    return timeDiff >= -60 * 60 * 1000 && timeDiff <= 15 * 60 * 1000;
  };

  const getSessionStatus = (date: string, time: string) => {
    const sessionDateTime = new Date(`${date} ${time}`);
    const now = new Date();
    
    if (sessionDateTime > now) {
      return 'upcoming';
    } else if (isSessionLive(date, time)) {
      return 'live';
    } else {
      return 'completed';
    }
  };

  const handleJoinSession = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  const upcomingBookings = bookings.filter(booking => 
    getSessionStatus(booking.date, booking.time) === 'upcoming' ||
    getSessionStatus(booking.date, booking.time) === 'live'
  );

  const pastBookings = bookings.filter(booking => 
    getSessionStatus(booking.date, booking.time) === 'completed'
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">Manage your bookings and join upcoming sessions</p>
        </div>

        <div className="grid gap-8">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Button asChild>
                  <Link to="/sessions">
                    <Calendar className="h-4 w-4 mr-2" />
                    Browse Sessions
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/sessions">
                    <User className="h-4 w-4 mr-2" />
                    Find Experts
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Upcoming Sessions ({upcomingBookings.length})
              </CardTitle>
              <CardDescription>
                Your scheduled sessions and meetings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length === 0 ? (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No upcoming sessions</p>
                  <Button asChild>
                    <Link to="/sessions">Browse Available Sessions</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => {
                    const status = getSessionStatus(booking.date, booking.time);
                    const sessionDate = new Date(booking.date);
                    
                    return (
                      <div key={booking.id} className="border rounded-lg p-4 hover:bg-accent/50 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">{booking.sessionType}</h3>
                              <Badge variant={status === 'live' ? 'default' : 'secondary'}>
                                {status === 'live' ? 'Live Now' : 'Upcoming'}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              with <strong>{booking.expertName}</strong> • {booking.expertTitle}
                            </p>
                            <p className="text-sm text-muted-foreground">{booking.sessionGoals}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold">${booking.price}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {sessionDate.toDateString()}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {booking.time}
                            </div>
                          </div>
                          
                          <div className="flex gap-2">
                            {status === 'live' && (
                              <Button 
                                onClick={() => handleJoinSession(booking.meetingLink)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Join Now
                              </Button>
                            )}
                            {status === 'upcoming' && (
                              <Button 
                                variant="outline"
                                onClick={() => handleJoinSession(booking.meetingLink)}
                              >
                                <Video className="h-4 w-4 mr-2" />
                                Meeting Link
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Past Sessions */}
          {pastBookings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Past Sessions ({pastBookings.length})
                </CardTitle>
                <CardDescription>
                  Your completed sessions and meetings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pastBookings.slice(0, 3).map((booking) => {
                    const sessionDate = new Date(booking.date);
                    
                    return (
                      <div key={booking.id} className="border rounded-lg p-4 opacity-75">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold">{booking.sessionType}</h3>
                              <Badge variant="outline">Completed</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              with <strong>{booking.expertName}</strong> • {booking.expertTitle}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">${booking.price}</div>
                            <div className="text-xs text-muted-foreground">
                              {sessionDate.toDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {booking.time}
                          </div>
                          <Button variant="outline" size="sm">
                            <Star className="h-4 w-4 mr-1" />
                            Rate Session
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
