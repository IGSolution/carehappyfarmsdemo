import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { LocationType } from '@/types/database';
import { CheckCircle } from 'lucide-react';

const locations: { value: LocationType; label: string }[] = [
  { value: 'lagos', label: 'Lagos' },
  { value: 'abuja', label: 'Abuja' },
  { value: 'kano', label: 'Kano' },
  { value: 'ibadan', label: 'Ibadan' },
  { value: 'port_harcourt', label: 'Port Harcourt' },
  { value: 'kaduna', label: 'Kaduna' },
  { value: 'benin', label: 'Benin' },
  { value: 'maiduguri', label: 'Maiduguri' },
  { value: 'zaria', label: 'Zaria' },
  { value: 'aba', label: 'Aba' },
  { value: 'jos', label: 'Jos' },
  { value: 'ilorin', label: 'Ilorin' }
];

export default function Auth() {
  const [activeTab, setActiveTab] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const role ='customer';
  const [location, setLocation] = useState<LocationType>('lagos');
  const [loading, setLoading] = useState(false);
  const [signUpSuccess, setSignUpSuccess] = useState(false);
  
  const { signUp, signIn, user, verifyEmail } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // Check for confirmation status
    const confirmed = searchParams.get('confirmed');
    if (confirmed === 'true') {
      toast({
        title: "Email confirmed!",
        description: "You can now sign in to your account.",
      });
    }

    // Handle email verification from URL
    const token_hash = searchParams.get('token_hash');
    if (token_hash) {
      handleEmailVerification(token_hash);
    }
  }, [searchParams, toast]);

  // Redirect if already authenticated and verified
  useEffect(() => {
    if (user && user.email_confirmed_at) {
      console.log('User is authenticated and email confirmed, redirecting to marketplace',user.email_confirmed_at,user);
      navigate('/');
    }
  }, [user, navigate]);

  const handleEmailVerification = async (token_hash: string) => {
    try {
      const { data, error } = await verifyEmail(token_hash);

      if (error) {
        console.error('Email verification error:', error);
        toast({
          title: "Verification failed",
          description: error.message || "Failed to verify email. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Email verification successful');
        toast({
          title: "Email verified!",
          description: "Your email has been verified successfully. You can now sign in.",
        });
        // Remove the token from URL
        window.history.replaceState({}, document.title, "/auth?confirmed=true");
      }
    } catch (error) {
      console.error('Email verification catch error:', error);
      toast({
        title: "Verification failed",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting sign in for:', email);
      const { data, error } = await signIn(email, password);

      if (error) {
        console.error('Sign in error:', error);
        throw error;
      }

      console.log('Sign in successful');
      
    } catch (error: any) {
      console.error('Sign in error:', error);
      
      // Handle specific error messages
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

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('Attempting sign up for:', email, 'as role:', role);
      const { data, error } = await signUp(email, password, {
        full_name: fullName,
        phone,
        role,
        location
      });

      if (error) {
        console.error('Sign up error:', error);
        throw error;
      }

      console.log('Sign up successful:', data);
      setSignUpSuccess(true);
      toast({
        title: "Account created!",
        description: "Please check your email and click the confirmation link to activate your account.",
      });
      
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast({
        title: "Registration failed",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Show success message after signup
  if (signUpSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Registration Successful!</CardTitle>
            <CardDescription>
              We've sent a confirmation link to <strong>{email}</strong>. Please click the link in your email to confirm your account before signing in.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Didn't receive the email? Check your spam folder or try signing up again.
            </p>
            <Button 
              onClick={() => {
                setSignUpSuccess(false);
                setActiveTab('signin');
              }}
              className="w-full"
            >
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">KRP Farm</CardTitle>
          <CardDescription className="text-center">
            {activeTab === 'signup' ? 'Create your account' : 'Sign in to your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>

                <p className="text-sm text-center text-gray-600">
                  Note: You must verify your email before signing in
                </p>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              {/* <Tabs value={role} onValueChange={(value: any) => setRole(value)} className="mb-6">
                <TabsList className="grid w-full ">
                  <TabsTrigger value="customer w-full">Customer</TabsTrigger>
                  <TabsTrigger value="farmer">Farmer</TabsTrigger>
                </TabsList>
              </Tabs> */}

              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Select value={location} onValueChange={(value: LocationType) => setLocation(value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.value} value={loc.value}>
                          {loc.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Creating Account...' : 'Sign Up'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
