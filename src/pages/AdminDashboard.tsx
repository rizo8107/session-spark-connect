import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Users, Calendar, DollarSign, TrendingUp, UserCheck, AlertCircle, Star, Clock, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isAddExpertOpen, setIsAddExpertOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      name: '',
      email: '',
      expertise: '',
      hourlyRate: '',
      bio: ''
    }
  });

  // Mock data
  const stats = {
    totalExperts: 24,
    totalUsers: 156,
    totalSessions: 89,
    monthlyRevenue: 15420,
    pendingExperts: 3,
    avgRating: 4.7
  };

  const recentSessions = [
    {
      id: '1',
      expertName: 'Dr. Sarah Johnson',
      userName: 'John Doe',
      sessionTitle: '1:1 Product Strategy',
      date: '2024-01-15',
      time: '10:00 AM',
      status: 'completed',
      amount: 150,
      rating: 5
    },
    {
      id: '2',
      expertName: 'Michael Chen',
      userName: 'Jane Smith',
      sessionTitle: 'Career Coaching',
      date: '2024-01-15',
      time: '02:00 PM',
      status: 'upcoming',
      amount: 120,
      rating: null
    },
    {
      id: '3',
      expertName: 'Emma Wilson',
      userName: 'Bob Johnson',
      sessionTitle: 'Design Review',
      date: '2024-01-14',
      time: '04:00 PM',
      status: 'cancelled',
      amount: 100,
      rating: null
    }
  ];

  const pendingExperts = [
    {
      id: '1',
      name: 'Alex Rodriguez',
      email: 'alex@example.com',
      expertise: 'Data Science',
      appliedDate: '2024-01-10',
      status: 'pending'
    },
    {
      id: '2',
      name: 'Lisa Wang',
      email: 'lisa@example.com',
      expertise: 'Product Marketing',
      appliedDate: '2024-01-12',
      status: 'under_review'
    }
  ];

  const topExperts = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      sessions: 45,
      revenue: 6750,
      rating: 4.9,
      status: 'active'
    },
    {
      id: '2',
      name: 'Michael Chen',
      sessions: 32,
      revenue: 3840,
      rating: 4.8,
      status: 'active'
    },
    {
      id: '3',
      name: 'Emma Wilson',
      sessions: 28,
      revenue: 2800,
      rating: 4.6,
      status: 'active'
    }
  ];

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-100 text-green-800',
      upcoming: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      under_review: 'bg-orange-100 text-orange-800'
    };
    return variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800';
  };

  const handleApproveExpert = (expertId: string) => {
    console.log('Approving expert:', expertId);
    // Add approval logic here
  };

  const handleRejectExpert = (expertId: string) => {
    console.log('Rejecting expert:', expertId);
    // Add rejection logic here
  };

  const handleAddExpert = (data: any) => {
    console.log('Adding new expert:', data);
    // Add expert creation logic here
    setIsAddExpertOpen(false);
    form.reset();
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {user?.name}! Here's what's happening on your platform.</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="experts">Expert Management</TabsTrigger>
            <TabsTrigger value="sessions">Sessions</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Experts</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalExperts}</div>
                  <p className="text-xs text-muted-foreground">
                    +2 from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                  <UserCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalUsers}</div>
                  <p className="text-xs text-muted-foreground">
                    +12 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalSessions}</div>
                  <p className="text-xs text-muted-foreground">
                    +8 from last week
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
                  <p className="text-xs text-muted-foreground">
                    +20.1% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.pendingExperts}</div>
                  <p className="text-xs text-muted-foreground">
                    Experts waiting for approval
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.avgRating}</div>
                  <p className="text-xs text-muted-foreground">
                    Platform average
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Sessions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
                <CardDescription>Latest session bookings and completions</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expert</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Session</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Rating</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">{session.expertName}</TableCell>
                        <TableCell>{session.userName}</TableCell>
                        <TableCell>{session.sessionTitle}</TableCell>
                        <TableCell>{session.date} at {session.time}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(session.status)}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>${session.amount}</TableCell>
                        <TableCell>
                          {session.rating ? (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                              {session.rating}
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="experts" className="space-y-6">
            {/* Add Expert Button */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Expert Management</h2>
                <p className="text-muted-foreground">Manage expert applications and existing experts</p>
              </div>
              <Dialog open={isAddExpertOpen} onOpenChange={setIsAddExpertOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Expert
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Add New Expert</DialogTitle>
                    <DialogDescription>
                      Add a new expert to the platform manually.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleAddExpert)} className="space-y-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Dr. Sarah Johnson" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="sarah@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="expertise"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Expertise</FormLabel>
                            <FormControl>
                              <Input placeholder="Product Strategy" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hourlyRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hourly Rate ($)</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="150" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="bio"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Bio</FormLabel>
                            <FormControl>
                              <Input placeholder="Brief description of expertise..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setIsAddExpertOpen(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">Add Expert</Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            {/* Pending Expert Approvals */}
            <Card>
              <CardHeader>
                <CardTitle>Pending Expert Applications</CardTitle>
                <CardDescription>Review and approve new expert applications</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Expertise</TableHead>
                      <TableHead>Applied Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingExperts.map((expert) => (
                      <TableRow key={expert.id}>
                        <TableCell className="font-medium">{expert.name}</TableCell>
                        <TableCell>{expert.email}</TableCell>
                        <TableCell>{expert.expertise}</TableCell>
                        <TableCell>{expert.appliedDate}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(expert.status)}>
                            {expert.status.replace('_', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              onClick={() => handleApproveExpert(expert.id)}
                            >
                              Approve
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleRejectExpert(expert.id)}
                            >
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Top Performing Experts */}
            <Card>
              <CardHeader>
                <CardTitle>Top Performing Experts</CardTitle>
                <CardDescription>Experts with highest bookings and ratings</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Expert</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Revenue</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topExperts.map((expert) => (
                      <TableRow key={expert.id}>
                        <TableCell className="font-medium">{expert.name}</TableCell>
                        <TableCell>{expert.sessions}</TableCell>
                        <TableCell>${expert.revenue}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                            {expert.rating}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(expert.status)}>
                            {expert.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button size="sm" variant="outline">
                            View Profile
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All Sessions</CardTitle>
                <CardDescription>Complete session management and monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 flex gap-4">
                  <Button variant="outline">Filter by Date</Button>
                  <Button variant="outline">Filter by Expert</Button>
                  <Button variant="outline">Filter by Status</Button>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Session ID</TableHead>
                      <TableHead>Expert</TableHead>
                      <TableHead>User</TableHead>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentSessions.map((session) => (
                      <TableRow key={session.id}>
                        <TableCell className="font-medium">#{session.id.padStart(4, '0')}</TableCell>
                        <TableCell>{session.expertName}</TableCell>
                        <TableCell>{session.userName}</TableCell>
                        <TableCell>{session.date} at {session.time}</TableCell>
                        <TableCell>60 min</TableCell>
                        <TableCell>${session.amount}</TableCell>
                        <TableCell>
                          <Badge className={getStatusBadge(session.status)}>
                            {session.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              View
                            </Button>
                            {session.status === 'upcoming' && (
                              <Button size="sm" variant="outline">
                                Cancel
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Monthly revenue trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">${stats.monthlyRevenue}</div>
                  <div className="flex items-center text-sm text-green-600">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    +20.1% from last month
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    Platform commission: ${Math.round(stats.monthlyRevenue * 0.15)}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Session Analytics</CardTitle>
                  <CardDescription>Session completion and booking rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Completion Rate</span>
                      <span className="text-sm font-medium">94%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Cancellation Rate</span>
                      <span className="text-sm font-medium">6%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Duration</span>
                      <span className="text-sm font-medium">58 min</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>New user registrations</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold mb-2">+24</div>
                  <div className="text-sm text-muted-foreground">New users this week</div>
                  <div className="mt-4 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>This week</span>
                      <span>24 users</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Last week</span>
                      <span>18 users</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expert Performance</CardTitle>
                  <CardDescription>Average expert metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Average Rating</span>
                      <span className="text-sm font-medium">4.7/5</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sessions per Expert</span>
                      <span className="text-sm font-medium">3.7</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Average Earnings</span>
                      <span className="text-sm font-medium">$642</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
