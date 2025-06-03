import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Clock, Mail } from 'lucide-react';

export default function ConfirmEmail() {
  const { resendConfirmation } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchParams] = useSearchParams();
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmationState, setConfirmationState] = useState<'loading' | 'success' | 'error' | 'expired' | 'already-confirmed'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const token_hash = searchParams.get('token_hash');
    const type = searchParams.get('type');
    
    if (!token_hash || type !== 'signup') {
      setConfirmationState('error');
      setErrorMessage('Invalid confirmation link.');
      return;
    }

    handleEmailConfirmation(token_hash);
  }, [searchParams]);

  const handleEmailConfirmation = async (token_hash: string) => {
    setIsConfirming(true);
    
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash,
        type: 'signup'
      });

      if (error) {
        console.error('Email verification error:', error);
        if (error.message.includes('expired')) {
          setConfirmationState('expired');
        } else if (error.message.includes('already been confirmed')) {
          setConfirmationState('already-confirmed');
        } else {
          setConfirmationState('error');
          setErrorMessage(error.message);
        }
      } else {
        console.log('Email verification successful:', data);
        setConfirmationState('success');
        toast({
          title: "Email confirmed successfully!",
          description: "You can now sign in to your account.",
        });
        
        // Redirect to auth page after 3 seconds
        setTimeout(() => {
          navigate('/auth?confirmed=true');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Email verification catch error:', error);
      setConfirmationState('error');
      setErrorMessage('An unexpected error occurred.');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleResendConfirmation = async () => {
    setIsResending(true);
    
    try {
      const { error } = await resendConfirmation();
      
      if (error) {
        toast({
          title: "Failed to resend confirmation",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Confirmation email sent",
          description: "Please check your email for the new confirmation link.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to resend confirmation email.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  if (isConfirming) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p>Confirming your email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (confirmationState === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <CardTitle className="text-2xl text-green-600">Email Confirmed Successfully!</CardTitle>
            <CardDescription>
              Your email has been confirmed. You will be redirected to sign in shortly.
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

  if (confirmationState === 'already-confirmed') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CheckCircle className="w-16 h-16 text-blue-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Email Already Confirmed</CardTitle>
            <CardDescription>
              Your email has already been confirmed. You can sign in to your account.
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

  if (confirmationState === 'expired') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <Clock className="w-16 h-16 text-orange-600 mx-auto mb-4" />
            <CardTitle className="text-2xl">Confirmation Link Expired</CardTitle>
            <CardDescription>
              This confirmation link has expired. Please request a new confirmation email.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button 
              onClick={handleResendConfirmation}
              disabled={isResending}
              className="w-full"
            >
              {isResending ? 'Sending...' : 'Resend Confirmation Email'}
            </Button>
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

  // Error state
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          <CardTitle className="text-2xl">Confirmation Failed</CardTitle>
          <CardDescription>
            {errorMessage || 'Unable to confirm your email. Please try again.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <Button 
            onClick={handleResendConfirmation}
            disabled={isResending}
            className="w-full"
          >
            {isResending ? 'Sending...' : 'Resend Confirmation Email'}
          </Button>
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
