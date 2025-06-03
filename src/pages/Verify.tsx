
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, Mail } from 'lucide-react';

export default function Verify() {
  const { user, profile, verifyEmail, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [hasToken, setHasToken] = useState(false);

  const handleEmailVerification = useCallback(async (token_hash: string) => {
    setIsVerifying(true);
    try {
      console.log('Starting email verification with token:', token_hash);
      
      const { data, error } = await verifyEmail(token_hash);

      console.log('Verification result:', { data, error });

      if (error) {
        console.error('Verification error:', error);
        toast({
          title: "Verification failed",
          description: error.message || "Failed to verify email. Please try again.",
          variant: "destructive",
        });
      } else {
        console.log('Email verified successfully');
        setVerificationComplete(true);
        
        // Refresh user profile after verification
        await refreshProfile();
        
        toast({
          title: "Email verified successfully!",
          description: "You can now sign in to your account.",
        });
        
        // Redirect to auth page with success message after a short delay
        setTimeout(() => {
          navigate('/auth?message=verified');
        }, 2000);
      }
    } catch (error: any) {
      console.error('Verification catch error:', error);
      toast({
        title: "Verification error",
        description: "Something went wrong during verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  }, [verifyEmail, refreshProfile, toast, navigate]);

  useEffect(() => {
    // Check if we have verification token in URL
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    
    console.log('URL params:', { token_hash, type });
    
    if (token_hash && type === 'signup') {
      setHasToken(true);
      handleEmailVerification(token_hash);
    }
  }, [searchParams, handleEmailVerification]);

  // If user is already signed in and verified, redirect based on role
  useEffect(() => {
    if (user && profile?.is_verified) {
      console.log('User is already verified, redirecting based on role:', profile.role);
      if (profile.role === 'farmer') {
        navigate('/dashboard');
      } else {
        navigate('/marketplace');
      }
    }
  }, [user, profile, navigate]);

  // Show verification success message
  if (verificationComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Email Verified Successfully!</CardTitle>
            <CardDescription>
              Your email has been verified. You will be redirected to sign in shortly.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={() => navigate('/auth')} className="w-full">
              Go to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show verification in progress
  if (isVerifying) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Verifying your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If user is signed in but not verified and no token in URL, show verification pending
  if (user && !profile?.is_verified && !hasToken) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Mail className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Verify Your Email</CardTitle>
            <CardDescription>
              We've sent a verification link to <strong>{user.email}</strong>. Please check your email and click the link to verify your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-sm text-gray-600">
              Didn't receive the email? Check your spam folder.
            </p>
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="w-full"
            >
              Back to Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // If no verification token and no user, redirect to auth
  if (!hasToken && !user) {
    navigate('/auth');
    return null;
  }

  // Default loading state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardContent className="pt-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p>Loading...</p>
        </CardContent>
      </Card>
    </div>
  );
}
