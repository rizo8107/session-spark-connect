
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import { Search, Star, Clock, DollarSign, Filter } from 'lucide-react';

const Sessions = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API calls
  const mockExperts = [
    {
      id: '1',
      name: 'Dr. Sarah Johnson',
      title: 'Product Management Expert',
      avatar: '/placeholder.svg?height=100&width=100',
      rating: 4.9,
      reviews: 127,
      priceRange: '$50-100',
      specialties: ['Product Strategy', 'Team Leadership', 'User Research'],
      nextAvailable: '2024-01-15T10:00:00Z',
      description: 'Former VP of Product at major tech companies. 10+ years experience in scaling products from 0 to millions of users.',
    },
    {
      id: '2',
      name: 'Mark Chen',
      title: 'Software Architecture Consultant',
      avatar: '/placeholder.svg?height=100&width=100',
      rating: 4.8,
      reviews: 89,
      priceRange: '$75-150',
      specialties: ['System Design', 'Microservices', 'Cloud Architecture'],
      nextAvailable: '2024-01-15T14:00:00Z',
      description: 'Senior architect with experience at Google and Amazon. Specializes in distributed systems and scalable architectures.',
    },
    {
      id: '3',
      name: 'Lisa Rodriguez',
      title: 'UX Design Leader',
      avatar: '/placeholder.svg?height=100&width=100',
      rating: 4.9,
      reviews: 203,
      priceRange: '$40-80',
      specialties: ['User Experience', 'Design Systems', 'Research'],
      nextAvailable: '2024-01-16T09:00:00Z',
      description: 'Design director with 8+ years creating user-centered products. Expert in design thinking and user research methodologies.',
    },
  ];

  const filteredExperts = mockExperts.filter(expert =>
    expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expert.specialties.some(specialty => 
      specialty.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Browse Expert Sessions</h1>
          <p className="text-muted-foreground text-lg mb-6">
            Connect with industry experts and book personalized learning sessions
          </p>
          
          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, expertise, or topic..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start space-x-4">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
                    <span className="text-lg font-semibold">
                      {expert.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{expert.name}</CardTitle>
                    <CardDescription className="text-sm font-medium text-primary">
                      {expert.title}
                    </CardDescription>
                    <div className="flex items-center mt-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 text-sm font-medium">{expert.rating}</span>
                      <span className="ml-1 text-sm text-muted-foreground">
                        ({expert.reviews} reviews)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {expert.description}
                </p>
                
                <div className="flex flex-wrap gap-1">
                  {expert.specialties.slice(0, 3).map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {specialty}
                    </Badge>
                  ))}
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-muted-foreground">
                    <DollarSign className="h-4 w-4 mr-1" />
                    {expert.priceRange}
                  </div>
                  <div className="flex items-center text-muted-foreground">
                    <Clock className="h-4 w-4 mr-1" />
                    Next: Today 2PM
                  </div>
                </div>
                
                <Button className="w-full" asChild>
                  <Link to={`/expert/${expert.id}`}>
                    View Profile & Book
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No experts found matching your search.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
