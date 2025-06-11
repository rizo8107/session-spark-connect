
import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Clock, MapPin, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExperts } from '@/hooks/useExperts';

const Sessions = () => {
  const { data: experts = [], isLoading } = useExperts();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  const allSkills = Array.from(
    new Set(experts.flatMap(expert => expert.skills || []))
  );

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.profiles?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSkill = selectedSkill === 'all' || 
                        (expert.skills && expert.skills.includes(selectedSkill));
    
    const matchesPrice = priceRange === 'all' || (() => {
      const rate = expert.hourly_rate || 0;
      switch (priceRange) {
        case 'low': return rate < 50;
        case 'medium': return rate >= 50 && rate <= 100;
        case 'high': return rate > 100;
        default: return true;
      }
    })();

    return matchesSearch && matchesSkill && matchesPrice;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-lg">Loading experts...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Find Your Expert</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Connect with verified professionals for personalized guidance and support
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search by name or specialty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedSkill} onValueChange={setSelectedSkill}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Select skill" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {allSkills.map(skill => (
                  <SelectItem key={skill} value={skill}>{skill}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Price range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="low">Under $50/hr</SelectItem>
                <SelectItem value="medium">$50-$100/hr</SelectItem>
                <SelectItem value="high">Over $100/hr</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredExperts.length} expert{filteredExperts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Expert Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert) => (
            <Card key={expert.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{expert.profiles?.name || 'Expert'}</CardTitle>
                    <CardDescription className="text-base font-medium text-blue-600">
                      {expert.title}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">
                      {expert.rating?.toFixed(1) || 'New'}
                    </span>
                    <span className="text-xs text-gray-500">
                      ({expert.reviews_count || 0})
                    </span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Location and Languages */}
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{expert.location || 'Remote'}</span>
                    {expert.languages && expert.languages.length > 0 && (
                      <>
                        <span className="mx-2">•</span>
                        <span>{expert.languages.join(', ')}</span>
                      </>
                    )}
                  </div>

                  {/* Skills */}
                  {expert.skills && expert.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {expert.skills.slice(0, 3).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {expert.skills.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{expert.skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Session Types */}
                  {expert.session_types && expert.session_types.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-gray-900">Available Sessions:</h4>
                      {expert.session_types.slice(0, 2).map((session) => (
                        <div key={session.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-gray-400" />
                            <span>{session.title}</span>
                          </div>
                          <span className="font-medium">${(session.price / 100).toFixed(0)}</span>
                        </div>
                      ))}
                      {expert.session_types.length > 2 && (
                        <p className="text-xs text-gray-500">
                          +{expert.session_types.length - 2} more sessions
                        </p>
                      )}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between text-sm text-gray-600 pt-2 border-t">
                    <span>{expert.sessions_completed || 0} sessions completed</span>
                    <span>${expert.hourly_rate || 0}/hr</span>
                  </div>

                  {/* Action Button */}
                  <Link to={`/expert/${expert.id}`}>
                    <Button className="w-full">
                      View Profile
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 mb-4">
              <Filter className="w-12 h-12 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No experts found</h3>
              <p>Try adjusting your search criteria or filters</p>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setSelectedSkill('all');
                setPriceRange('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sessions;
