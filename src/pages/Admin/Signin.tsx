
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Leaf, ShieldCheck } from 'lucide-react';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  if (user && user.email_confirmed_at) {
    navigate('/dashboard');
    return null;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting admin sign in for:', email);
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error('Admin sign in error:', error);
        throw error;
      }

      // Check if user has admin role
      if (data?.user) {
        console.log('Admin sign in successful');
        // AuthProvider will handle redirect based on role
      }
      
    } catch (error: any) {
      console.error('Admin sign in error:', error);
      
      let errorMessage = error.message;
      if (error.message === 'Invalid login credentials') {
        errorMessage = 'Invalid email or password. Please check your credentials and try again.';
      } else if (error.message.includes('confirm your email')) {
        errorMessage = 'Please confirm your email before signing in. Check your email for the confirmation link.';
      }
      
      toast({
        title: "Sign in failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Leaf className="h-8 w-8 text-green-600" />
            <span className="text-2xl font-bold">KRP FARM</span>
          </div>
          <div className="flex items-center justify-center mb-2">
            <ShieldCheck className="h-6 w-6 text-blue-600 mr-2" />
            <CardTitle className="text-2xl text-center text-blue-600">Admin Portal</CardTitle>
          </div>
          <CardDescription className="text-center">
            Sign in to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="admin-email">Email</Label>
              <Input
                id="admin-email"
                type="email"
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin-password">Password</Label>
              <Input
                id="admin-password"
                type="password"
                placeholder="Enter your admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Need an admin account?{' '}
                <span className="text-blue-600">Contact your administrator for an invitation</span>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
