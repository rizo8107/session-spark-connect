
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Header from '@/components/Header';
import { Calendar, Users, Video, Star, ArrowRight, CheckCircle } from 'lucide-react';

const Index = () => {
  const features = [
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Easy Scheduling",
      description: "Book sessions with experts in just a few clicks"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Video Integration",
      description: "Automatic Google Meet links for all sessions"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Expert Network",
      description: "Connect with verified professionals across industries"
    },
    {
      icon: <Star className="h-6 w-6" />,
      title: "Ratings & Reviews",
      description: "Choose experts based on verified feedback"
    }
  ];

  const benefits = [
    "Instant booking confirmation",
    "Automatic calendar sync",
    "Secure payment processing",
    "Multi-timezone support",
    "Mobile-friendly interface",
    "24/7 customer support"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
            Book Expert Sessions
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Connect with industry experts, schedule sessions instantly, and grow your skills with personalized guidance.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" asChild>
              <Link to="/sessions">
                Browse Sessions
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8" asChild>
              <Link to="/register">Become an Expert</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-muted/30">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SessionBook?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit text-primary">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Everything You Need for Seamless Booking</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Our platform provides all the tools you need to connect with experts and manage your learning journey.
              </p>
              <div className="grid sm:grid-cols-2 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-primary/10 to-blue-500/10 rounded-lg p-8">
              <h3 className="text-2xl font-bold mb-4">Ready to get started?</h3>
              <p className="text-muted-foreground mb-6">
                Join thousands of learners who are already advancing their careers with expert guidance.
              </p>
              <Button size="lg" className="w-full" asChild>
                <Link to="/register">Start Your Journey</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 SessionBook. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
