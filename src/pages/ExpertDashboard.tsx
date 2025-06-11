
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, DollarSign, Users, Star, Settings, Video, CheckCircle, XCircle, Calendar as CalendarIcon } from 'lucide-react';

const ExpertDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app this would come from API
  const stats = {
    totalSessions: 45,
    upcomingSessions: 8,
    totalEarnings: 4500,
    avgRating: 4.8,
    responseRate: 95
  };

  const upcomingSessions = [
    {
      id: '1',
      clientName: 'John Doe',
      topic: 'Career Guidance',
      date: '2024-06-12',
      time: '10:00 AM',
      duration: 60,
      price: 100,
      meetingLink: 'https://meet.google.com/abc-def-ghi',
      status: 'confirmed'
    },
    {
      id: '2',
      clientName: 'Sarah Wilson',
      topic: 'Tech Interview Prep',
      date: '2024-06-12',
      time: '2:00 PM',
      duration: 30,
      price: 50,
      meetingLink: 'https://meet.google.com/xyz-uvw-rst',
      status: 'confirmed'
    },
    {
      id: '3',
      clientName: 'Mike Johnson',
      topic: 'Product Strategy',
      date: '2024-06-13',
      time: '11:00 AM',
      duration: 45,
      price: 75,
      meetingLink: 'https://meet.google.com/lmn-opq-tuv',
      status: 'pending'
    }
  ];

  const pastSessions = [
    {
      id: '4',
      clientName: 'Emma Brown',
      topic: 'Startup Funding',
      date: '2024-06-10',
      time: '3:00 PM',
      duration: 60,
      price: 100,
      rating: 5,
      feedback: 'Excellent session! Very helpful insights.',
      status: 'completed'
    },
    {
      id: '5',
      clientName: 'David Lee',
      topic: 'Career Transition',
      date: '2024-06-09',
      time: '1:00 PM',
      duration: 30,
      price: 50,
      rating: 4,
      feedback: 'Good advice, would recommend.',
      status: 'completed'
    }
  ];

  const availabilitySlots = [
    { day: 'Monday', slots: ['9:00 AM - 12:00 PM', '2:00 PM - 5:00 PM'] },
    { day: 'Tuesday', slots: ['10:00 AM - 1:00 PM', '3:00 PM - 6:00 PM'] },
    { day: 'Wednesday', slots: ['9:00 AM - 12:00 PM'] },
    { day: 'Thursday', slots: ['1:00 PM - 5:00 PM'] },
    { day: 'Friday', slots: ['9:00 AM - 3:00 PM'] },
    { day: 'Saturday', slots: [] },
    { day: 'Sunday', slots: [] }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      confirmed: 'default',
      pending: 'secondary',
      completed: 'default',
      cancelled: 'destructive'
    } as const;
    
    return (
      <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>
        {status}
      </Badge>
    );
  };

  const handleJoinSession = (meetingLink: string) => {
    window.open(meetingLink, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Expert Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}!</p>
          </div>
          <Button>
            <Settings className="h-4 w-4 mr-2" />
            Profile Settings
          </Button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="availability">Availability</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.totalEarnings}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgRating}</div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.responseRate}%</div>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Manage your sessions and availability</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-4">
                <Button onClick={() => setActiveTab('availability')}>
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Update Availability
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('profile')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
                <Button variant="outline" onClick={() => setActiveTab('sessions')}>
                  <Clock className="h-4 w-4 mr-2" />
                  View Sessions
                </Button>
              </CardContent>
            </Card>

            {/* Upcoming Sessions Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Today's Sessions</CardTitle>
                <CardDescription>Your upcoming sessions for today</CardDescription>
              </CardHeader>
              <CardContent>
                {upcomingSessions.filter(session => session.date === '2024-06-12').length > 0 ? (
                  <div className="space-y-4">
                    {upcomingSessions.filter(session => session.date === '2024-06-12').map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h4 className="font-medium">{session.topic}</h4>
                          <p className="text-sm text-muted-foreground">
                            {session.clientName} • {session.time} • {session.duration} min
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusBadge(session.status)}
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinSession(session.meetingLink)}
                            disabled={session.status !== 'confirmed'}
                          >
                            <Video className="h-4 w-4 mr-1" />
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">No sessions scheduled for today</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Sessions</CardTitle>
                <CardDescription>Manage your scheduled sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {upcomingSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.clientName}</TableCell>
                        <TableCell>{session.topic}</TableCell>
                        <TableCell>{session.date} at {session.time}</TableCell>
                        <TableCell>{session.duration} min</TableCell>
                        <TableCell>${session.price}</TableCell>
                        <TableCell>{getStatusBadge(session.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleJoinSession(session.meetingLink)}
                              disabled={session.status !== 'confirmed'}
                            >
                              <Video className="h-4 w-4" />
                            </Button>
                            <Button size="sm" variant="outline">
                              Reschedule
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Past Sessions</CardTitle>
                <CardDescription>View completed sessions and feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Topic</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Feedback</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pastSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.clientName}</TableCell>
                        <TableCell>{session.topic}</TableCell>
                        <TableCell>{session.date}</TableCell>
                        <TableCell>${session.price}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-current text-yellow-400" />
                            {session.rating}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={session.feedback}>
                          {session.feedback}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="availability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Weekly Availability</CardTitle>
                <CardDescription>Set your available time slots for each day</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {availabilitySlots.map((day) => (
                    <div key={day.day} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="font-medium w-24">{day.day}</div>
                      <div className="flex-1 mx-4">
                        {day.slots.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {day.slots.map((slot, index) => (
                              <Badge key={index} variant="secondary">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">No availability</span>
                        )}
                      </div>
                      <Button size="sm" variant="outline">
                        Edit
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <Button>
                    <Clock className="h-4 w-4 mr-2" />
                    Update Availability
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Earnings Summary</CardTitle>
                <CardDescription>Track your earnings and payouts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">$4,500</div>
                    <div className="text-sm text-muted-foreground">Total Earnings</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">$1,200</div>
                    <div className="text-sm text-muted-foreground">This Month</div>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">$800</div>
                    <div className="text-sm text-muted-foreground">Pending Payout</div>
                  </div>
                </div>
                <Button>
                  <DollarSign className="h-4 w-4 mr-2" />
                  Request Payout
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>Manage your expert profile and session details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>Name:</strong> {user?.name}</p>
                      <p><strong>Email:</strong> {user?.email}</p>
                      <p><strong>Expertise:</strong> Product Management, Career Coaching</p>
                      <p><strong>Languages:</strong> English, Spanish</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Session Settings</h4>
                    <div className="space-y-2 text-sm">
                      <p><strong>30-min Session:</strong> $50</p>
                      <p><strong>60-min Session:</strong> $100</p>
                      <p><strong>Response Time:</strong> Within 2 hours</p>
                      <p><strong>Cancellation Policy:</strong> 24 hours notice</p>
                    </div>
                  </div>
                </div>
                <div className="mt-6">
                  <Button>
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ExpertDashboard;
