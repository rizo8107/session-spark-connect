
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { ArrowLeft, CreditCard, Calendar, Clock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BookingFormProps {
  expert: {
    name: string;
    title: string;
    avatar: string;
  };
  selectedDate: Date | undefined;
  selectedTimeSlot: string | null;
  onSuccess: () => void;
  onCancel: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({
  expert,
  selectedDate,
  selectedTimeSlot,
  onSuccess,
  onCancel
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    sessionGoals: '',
    additionalNotes: '',
    sessionType: '1:1 Product Strategy Session'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const sessionPrice = 150;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Simulate booking process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock booking success
      toast({
        title: "Booking Confirmed!",
        description: "You'll receive a confirmation email with the Google Meet link shortly."
      });

      // Store booking in localStorage (simulate database)
      const booking = {
        id: Date.now().toString(),
        expertName: expert.name,
        expertTitle: expert.title,
        date: selectedDate?.toISOString(),
        time: selectedTimeSlot,
        sessionType: formData.sessionType,
        price: sessionPrice,
        meetingLink: `https://meet.google.com/abc-defg-hij`,
        status: 'confirmed',
        ...formData
      };

      const existingBookings = JSON.parse(localStorage.getItem('userBookings') || '[]');
      localStorage.setItem('userBookings', JSON.stringify([...existingBookings, booking]));

      onSuccess();
    } catch (error) {
      toast({
        title: "Booking Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" onClick={onCancel} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <h1 className="text-3xl font-bold">Complete Your Booking</h1>
        <p className="text-muted-foreground">You're almost there! Fill in your details to confirm.</p>
      </div>

      <div className="grid gap-6">
        {/* Booking Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Booking Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                <User className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-semibold">{expert.name}</h3>
                <p className="text-sm text-muted-foreground">{expert.title}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Calendar className="h-4 w-4" />
                  Date
                </div>
                <div className="font-medium">{selectedDate?.toDateString()}</div>
              </div>
              <div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Clock className="h-4 w-4" />
                  Time
                </div>
                <div className="font-medium">{selectedTimeSlot}</div>
              </div>
            </div>
            
            <div className="flex justify-between items-center p-4 border rounded-lg">
              <span className="font-medium">{formData.sessionType}</span>
              <span className="text-2xl font-bold">${sessionPrice}</span>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader>
            <CardTitle>Your Information</CardTitle>
            <CardDescription>Please provide your details for the session</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email Address *</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 000-0000"
                />
              </div>

              <div>
                <Label htmlFor="sessionGoals">What do you want to achieve in this session? *</Label>
                <Textarea
                  id="sessionGoals"
                  name="sessionGoals"
                  value={formData.sessionGoals}
                  onChange={handleInputChange}
                  required
                  placeholder="Describe your goals and what you'd like to focus on..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleInputChange}
                  placeholder="Any additional information or special requests..."
                  rows={2}
                />
              </div>

              <div className="pt-6 border-t">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold">${sessionPrice}</span>
                </div>
                
                <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
                  <CreditCard className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Processing...' : `Pay $${sessionPrice} & Book Session`}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center mt-2">
                  You'll receive a Google Meet link and calendar invite after payment
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BookingForm;
