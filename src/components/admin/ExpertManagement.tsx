
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Star } from 'lucide-react';

interface Expert {
  id: string;
  title: string;
  status: string;
  rating?: number;
  sessions_completed?: number;
  profiles?: {
    name?: string;
  };
}

interface ExpertManagementProps {
  experts: Expert[];
  onApproveExpert: (expertId: string) => void;
  onRejectExpert: (expertId: string) => void;
  isUpdating: boolean;
}

const ExpertManagement: React.FC<ExpertManagementProps> = ({
  experts,
  onApproveExpert,
  onRejectExpert,
  isUpdating
}) => {
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
                          onClick={() => onApproveExpert(expert.id)}
                          disabled={isUpdating}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => onRejectExpert(expert.id)}
                          disabled={isUpdating}
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
  );
};

export default ExpertManagement;
