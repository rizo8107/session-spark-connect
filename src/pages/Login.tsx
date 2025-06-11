
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  // Clear form fields
  const clearForm = () => {
    setEmail('');
    setPassword('');
  };

  // Redirect if user is already logged in
  useEffect(() => {
    console.log('Login useEffect - user:', user?.email, 'role:', user?.role, 'authLoading:', authLoading);
    if (user && !authLoading) {
      console.log('User is logged in, determining redirect path...');
      let redirectPath = '/dashboard';
      
      // Determine redirect path based on user role
      if (user.role === 'admin') {
        redirectPath = '/admin-dashboard';
      } else if (user.role === 'expert') {
        redirectPath = '/expert-dashboard';
      } else {
        redirectPath = '/dashboard';
      }
      
      // Use the original 'from' path if it's not the login page
      const finalPath = from !== '/login' ? from : redirectPath;
      
      console.log('Redirecting to:', finalPath);
      navigate(finalPath, { replace: true });
    }
  }, [user, authLoading, navigate, from]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading || authLoading) return;
    
    setIsLoading(true);

    try {
      console.log('Attempting login for:', email);
      await login(email, password);
      console.log('Login successful, auth state should update automatically');
      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      clearForm();
      // Navigation will be handled by the useEffect above when user state updates
    } catch (error: any) {
      console.error('Login failed:', error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading state while auth is initializing
  if (authLoading) {
    console.log('Showing auth loading spinner');
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is already logged in, show loading while we redirect
  if (user) {
    console.log('User exists, showing redirect loading');
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-primary/10 rounded-full w-fit">
            <Calendar className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            Sign in to your SessionBook account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="flex space-x-2">
              <Button type="submit" className="flex-1" disabled={isLoading || authLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
              <Button type="button" variant="outline" onClick={clearForm} disabled={isLoading}>
                Clear
              </Button>
            </div>
          </form>
          
          <div className="mt-6 text-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Demo accounts for testing:
            </p>
            <div className="text-xs space-y-1 text-muted-foreground">
              <p>Admin: admin@demo.com</p>
              <p>Expert: expert@demo.com</p>
              <p>User: user@demo.com</p>
              <p>Password: any password</p>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
