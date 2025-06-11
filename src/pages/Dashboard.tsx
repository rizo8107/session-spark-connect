
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Calendar, Clock, Star, BookOpen, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();

  // Mock data for user's bookings
  const upcomingBookings = [
    {
      id: '1',
      expertName: 'Dr. Sarah Johnson',
      title: 'Product Strategy Session',
      date: '2024-01-15T10:00:00Z',
      duration: 60,
      status: 'confirmed',
    },
    {
      id: '2',
      expertName: 'Mark Chen',
      title: 'System Architecture Review',
      date: '2024-01-16T14:00:00Z',
      duration: 90,
      status: 'confirmed',
    },
  ];

  const recentBookings = [
    {
      id: '3',
      expertName: 'Lisa Rodriguez',
      title: 'UX Design Consultation',
      date: '2024-01-10T09:00:00Z',
      rating: 5,
      status: 'completed',
    },
  ];

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-muted-foreground">
            Manage your bookings and continue your learning journey
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="h-5 w-5 mr-2 text-primary" />
                Browse Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Discover new experts and book learning sessions
              </p>
              <Button className="w-full" asChild>
                <Link to="/sessions">
                  Explore Sessions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="h-5 w-5 mr-2 text-primary" />
                Quick Stats
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Total Sessions:</span>
                  <span className="font-medium">3</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">This Month:</span>
                  <span className="font-medium">2</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Average Rating:</span>
                  <span className="font-medium">4.8 ⭐</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Clock className="h-5 w-5 mr-2 text-primary" />
                Next Session
              </CardTitle>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div>
                  <p className="font-medium">{upcomingBookings[0].title}</p>
                  <p className="text-sm text-muted-foreground">
                    with {upcomingBookings[0].expertName}
                  </p>
                  <p className="text-sm text-primary mt-2">
                    Today at 10:00 AM
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No upcoming sessions
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Bookings */}
        <div className="grid lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Upcoming Sessions
              </CardTitle>
              <CardDescription>
                Your scheduled learning sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingBookings.length > 0 ? (
                <div className="space-y-4">
                  {upcomingBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {booking.expertName}
                          </p>
                        </div>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {booking.status}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.date)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Duration: {booking.duration} minutes
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline">
                          Reschedule
                        </Button>
                        <Button size="sm">
                          Join Session
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No upcoming sessions
                  </p>
                  <Button asChild>
                    <Link to="/sessions">Book Your First Session</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Star className="h-5 w-5 mr-2" />
                Recent Sessions
              </CardTitle>
              <CardDescription>
                Your completed learning sessions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {recentBookings.map((booking) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="font-medium">{booking.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            with {booking.expertName}
                          </p>
                        </div>
                        <div className="flex">
                          {[...Array(booking.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(booking.date)}
                      </p>
                      <Button size="sm" variant="outline" className="mt-3">
                        View Details
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No completed sessions yet
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
