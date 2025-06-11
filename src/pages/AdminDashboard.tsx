
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Users, BookOpen, DollarSign, Star, Edit } from 'lucide-react';
import { useAdminExperts, useCreateExpert, useUpdateExpert } from '@/hooks/useExperts';
import { useBookings } from '@/hooks/useBookings';
import { useCreateSessionType } from '@/hooks/useSessionTypes';
import { toast } from 'sonner';

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const { data: experts = [], isLoading: expertsLoading } = useAdminExperts();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const createExpertMutation = useCreateExpert();
  const updateExpertMutation = useUpdateExpert();
  const createSessionTypeMutation = useCreateSessionType();

  const [isAddingExpert, setIsAddingExpert] = useState(false);
  const [newExpert, setNewExpert] = useState({
    title: '',
    experience: '',
    education: '',
    languages: [''],
    timezone: '',
    location: '',
    skills: [''],
    hourly_rate: 0,
    status: 'pending' as const,
  });
  const [newSessionTypes, setNewSessionTypes] = useState([
    { title: '', description: '', duration: 30, price: 0, type: 'video' as const }
  ]);

  if (isLoading || expertsLoading || bookingsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const addLanguage = () => {
    setNewExpert(prev => ({
      ...prev,
      languages: [...prev.languages, '']
    }));
  };

  const removeLanguage = (index: number) => {
    setNewExpert(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const updateLanguage = (index: number, value: string) => {
    setNewExpert(prev => ({
      ...prev,
      languages: prev.languages.map((lang, i) => i === index ? value : lang)
    }));
  };

  const addSkill = () => {
    setNewExpert(prev => ({
      ...prev,
      skills: [...prev.skills, '']
    }));
  };

  const removeSkill = (index: number) => {
    setNewExpert(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const updateSkill = (index: number, value: string) => {
    setNewExpert(prev => ({
      ...prev,
      skills: prev.skills.map((skill, i) => i === index ? value : skill)
    }));
  };

  const addSessionType = () => {
    setNewSessionTypes(prev => [
      ...prev,
      { title: '', description: '', duration: 30, price: 0, type: 'video' as const }
    ]);
  };

  const removeSessionType = (index: number) => {
    setNewSessionTypes(prev => prev.filter((_, i) => i !== index));
  };

  const updateSessionType = (index: number, field: string, value: any) => {
    setNewSessionTypes(prev =>
      prev.map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      )
    );
  };

  const handleSubmitExpert = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create expert
      const expertData = {
        ...newExpert,
        languages: newExpert.languages.filter(lang => lang.trim() !== ''),
        skills: newExpert.skills.filter(skill => skill.trim() !== ''),
        user_id: null, // Will be set when an actual user applies
      };

      const expert = await createExpertMutation.mutateAsync(expertData);

      // Create session types
      for (const sessionType of newSessionTypes) {
        if (sessionType.title.trim() !== '') {
          await createSessionTypeMutation.mutateAsync({
            ...sessionType,
            expert_id: expert.id,
            price: sessionType.price * 100, // Convert to cents
          });
        }
      }

      toast.success('Expert added successfully!');
      setIsAddingExpert(false);
      setNewExpert({
        title: '',
        experience: '',
        education: '',
        languages: [''],
        timezone: '',
        location: '',
        skills: [''],
        hourly_rate: 0,
        status: 'pending',
      });
      setNewSessionTypes([
        { title: '', description: '', duration: 30, price: 0, type: 'video' }
      ]);
    } catch (error) {
      toast.error('Failed to add expert');
      console.error('Error adding expert:', error);
    }
  };

  const handleApproveExpert = async (expertId: string) => {
    try {
      await updateExpertMutation.mutateAsync({
        id: expertId,
        updates: { status: 'approved' }
      });
      toast.success('Expert approved successfully!');
    } catch (error) {
      toast.error('Failed to approve expert');
    }
  };

  const handleRejectExpert = async (expertId: string) => {
    try {
      await updateExpertMutation.mutateAsync({
        id: expertId,
        updates: { status: 'rejected' }
      });
      toast.success('Expert rejected');
    } catch (error) {
      toast.error('Failed to reject expert');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: 'secondary',
      approved: 'default',
      rejected: 'destructive',
      active: 'default',
      inactive: 'secondary',
    } as const;
    
    return <Badge variant={variants[status as keyof typeof variants] || 'secondary'}>{status}</Badge>;
  };

  const stats = {
    totalExperts: experts.length,
    pendingApprovals: experts.filter(e => e.status === 'pending').length,
    totalBookings: bookings.length,
    totalRevenue: bookings.reduce((sum, booking) => sum + booking.price, 0) / 100,
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage experts and monitor platform activity</p>
          </div>
          <Button onClick={() => setIsAddingExpert(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expert
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Experts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalExperts}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingApprovals}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalBookings}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalRevenue}</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="experts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="experts" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Expert Management</CardTitle>
                <CardDescription>
                  Review and manage expert applications and profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Sessions</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {experts.map((expert) => (
                      <TableRow key={expert.id}>
                        <TableCell>
                          {expert.profiles?.name || 'N/A'}
                        </TableCell>
                        <TableCell>{expert.title}</TableCell>
                        <TableCell>{getStatusBadge(expert.status)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Star className="w-4 h-4 text-yellow-400 mr-1" />
                            {expert.rating?.toFixed(1) || 'N/A'}
                          </div>
                        </TableCell>
                        <TableCell>{expert.sessions_completed || 0}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            {expert.status === 'pending' && (
                              <>
                                <Button
                                  size="sm"
                                  onClick={() => handleApproveExpert(expert.id)}
                                  disabled={updateExpertMutation.isPending}
                                >
                                  Approve
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleRejectExpert(expert.id)}
                                  disabled={updateExpertMutation.isPending}
                                >
                                  Reject
                                </Button>
                              </>
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

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Monitor all platform bookings and sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Expert</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>{booking.profiles?.name || 'N/A'}</TableCell>
                        <TableCell>{booking.experts?.profiles?.name || 'N/A'}</TableCell>
                        <TableCell>
                          {new Date(booking.scheduled_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>{booking.duration} min</TableCell>
                        <TableCell>${(booking.price / 100).toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Add Expert Modal */}
        {isAddingExpert && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <CardHeader>
                <CardTitle>Add New Expert</CardTitle>
                <CardDescription>
                  Create a new expert profile with session offerings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmitExpert} className="space-y-6">
                  {/* Basic Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Professional Title</Label>
                      <Input
                        id="title"
                        value={newExpert.title}
                        onChange={(e) => setNewExpert(prev => ({ ...prev, title: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="hourly_rate">Hourly Rate ($)</Label>
                      <Input
                        id="hourly_rate"
                        type="number"
                        value={newExpert.hourly_rate}
                        onChange={(e) => setNewExpert(prev => ({ ...prev, hourly_rate: parseInt(e.target.value) }))}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newExpert.location}
                        onChange={(e) => setNewExpert(prev => ({ ...prev, location: e.target.value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="timezone">Timezone</Label>
                      <Input
                        id="timezone"
                        value={newExpert.timezone}
                        onChange={(e) => setNewExpert(prev => ({ ...prev, timezone: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="experience">Experience</Label>
                    <Textarea
                      id="experience"
                      value={newExpert.experience}
                      onChange={(e) => setNewExpert(prev => ({ ...prev, experience: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="education">Education</Label>
                    <Textarea
                      id="education"
                      value={newExpert.education}
                      onChange={(e) => setNewExpert(prev => ({ ...prev, education: e.target.value }))}
                      rows={3}
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <Label>Languages</Label>
                    {newExpert.languages.map((language, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={language}
                          onChange={(e) => updateLanguage(index, e.target.value)}
                          placeholder="Enter language"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeLanguage(index)}
                          disabled={newExpert.languages.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addLanguage}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Language
                    </Button>
                  </div>

                  {/* Skills */}
                  <div>
                    <Label>Skills</Label>
                    {newExpert.skills.map((skill, index) => (
                      <div key={index} className="flex items-center space-x-2 mt-2">
                        <Input
                          value={skill}
                          onChange={(e) => updateSkill(index, e.target.value)}
                          placeholder="Enter skill"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeSkill(index)}
                          disabled={newExpert.skills.length === 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSkill}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Skill
                    </Button>
                  </div>

                  {/* Session Types */}
                  <div>
                    <Label>Available Sessions</Label>
                    {newSessionTypes.map((session, index) => (
                      <div key={index} className="border p-4 rounded-lg mt-2 space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`session-title-${index}`}>Session Title</Label>
                            <Input
                              id={`session-title-${index}`}
                              value={session.title}
                              onChange={(e) => updateSessionType(index, 'title', e.target.value)}
                              placeholder="e.g., Initial Consultation"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`session-duration-${index}`}>Duration (minutes)</Label>
                            <Input
                              id={`session-duration-${index}`}
                              type="number"
                              value={session.duration}
                              onChange={(e) => updateSessionType(index, 'duration', parseInt(e.target.value))}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`session-price-${index}`}>Price ($)</Label>
                            <Input
                              id={`session-price-${index}`}
                              type="number"
                              value={session.price}
                              onChange={(e) => updateSessionType(index, 'price', parseInt(e.target.value))}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`session-type-${index}`}>Session Type</Label>
                            <Select
                              value={session.type}
                              onValueChange={(value) => updateSessionType(index, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="video">Video Call</SelectItem>
                                <SelectItem value="audio">Audio Call</SelectItem>
                                <SelectItem value="chat">Chat</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => removeSessionType(index)}
                              disabled={newSessionTypes.length === 1}
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remove Session
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label htmlFor={`session-description-${index}`}>Description</Label>
                          <Textarea
                            id={`session-description-${index}`}
                            value={session.description}
                            onChange={(e) => updateSessionType(index, 'description', e.target.value)}
                            placeholder="Describe what this session includes..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addSessionType}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Session Type
                    </Button>
                  </div>

                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={newExpert.status}
                      onValueChange={(value) => setNewExpert(prev => ({ ...prev, status: value as any }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsAddingExpert(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={createExpertMutation.isPending}
                    >
                      {createExpertMutation.isPending ? 'Adding...' : 'Add Expert'}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
