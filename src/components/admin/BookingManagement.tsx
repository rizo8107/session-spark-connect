
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface Booking {
  id: string;
  scheduled_at: string;
  duration: number;
  price: number;
  status: string;
  profiles?: {
    name?: string;
  };
  experts?: {
    profiles?: {
      name?: string;
    };
  };
}

interface BookingManagementProps {
  bookings: Booking[];
}

const BookingManagement: React.FC<BookingManagementProps> = ({ bookings }) => {
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

  return (
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
  );
};

export default BookingManagement;
