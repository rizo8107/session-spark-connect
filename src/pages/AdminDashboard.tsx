
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus } from 'lucide-react';
import { useAdminExperts, useUpdateExpert } from '@/hooks/useExperts';
import { useBookings } from '@/hooks/useBookings';
import { toast } from 'sonner';
import AdminStats from '@/components/admin/AdminStats';
import ExpertManagement from '@/components/admin/ExpertManagement';
import BookingManagement from '@/components/admin/BookingManagement';
import AddExpertModal from '@/components/admin/AddExpertModal';

const AdminDashboard = () => {
  const { user, isLoading } = useAuth();
  const { data: experts = [], isLoading: expertsLoading } = useAdminExperts();
  const { data: bookings = [], isLoading: bookingsLoading } = useBookings();
  const updateExpertMutation = useUpdateExpert();

  const [isAddingExpert, setIsAddingExpert] = useState(false);

  if (isLoading || expertsLoading || bookingsLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

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

        <AdminStats
          totalExperts={stats.totalExperts}
          pendingApprovals={stats.pendingApprovals}
          totalBookings={stats.totalBookings}
          totalRevenue={stats.totalRevenue}
        />

        <Tabs defaultValue="experts" className="space-y-6">
          <TabsList>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
          </TabsList>

          <TabsContent value="experts" className="space-y-6">
            <ExpertManagement
              experts={experts}
              onApproveExpert={handleApproveExpert}
              onRejectExpert={handleRejectExpert}
              isUpdating={updateExpertMutation.isPending}
            />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <BookingManagement bookings={bookings} />
          </TabsContent>
        </Tabs>

        <AddExpertModal
          isOpen={isAddingExpert}
          onClose={() => setIsAddingExpert(false)}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
