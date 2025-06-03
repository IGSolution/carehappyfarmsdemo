
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [verifying, setVerifying] = useState(true);
  const [paymentStatus, setPaymentStatus] = useState<'success' | 'failed' | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      const reference = searchParams.get('reference');
      const orderId = localStorage.getItem('pending_order_id');

      if (!reference || !orderId) {
        setPaymentStatus('failed');
        setVerifying(false);
        return;
      }

      try {
        const { data, error } = await supabase.functions.invoke('verify-payment', {
          body: {
            reference,
            orderId
          }
        });

        if (error) throw error;

        if (data.status && data.data?.status === 'success') {
          setPaymentStatus('success');
          
          // Clear cart items
          await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', (await supabase.auth.getUser()).data.user?.id);

          // Clear pending order ID
          localStorage.removeItem('pending_order_id');

          toast({
            title: "Payment Successful!",
            description: "Your order has been placed successfully.",
          });
        } else {
          setPaymentStatus('failed');
          toast({
            title: "Payment Failed",
            description: "Your payment could not be processed.",
            variant: "destructive",
          });
        }
      } catch (error: any) {
        console.error('Payment verification error:', error);
        setPaymentStatus('failed');
        toast({
          title: "Payment Verification Failed",
          description: "Unable to verify payment status.",
          variant: "destructive",
        });
      } finally {
        setVerifying(false);
      }
    };

    verifyPayment();
  }, [searchParams, toast]);

  if (verifying) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-green-600" />
            <h2 className="text-xl font-semibold mb-2">Verifying Payment</h2>
            <p className="text-gray-600">Please wait while we confirm your payment...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          {paymentStatus === 'success' ? (
            <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          ) : (
            <XCircle className="w-16 h-16 text-red-600 mx-auto mb-4" />
          )}
          <CardTitle className="text-2xl">
            {paymentStatus === 'success' ? 'Payment Successful!' : 'Payment Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-gray-600">
            {paymentStatus === 'success' 
              ? 'Thank you for your order! You will receive a confirmation email shortly.'
              : 'Your payment could not be processed. Please try again or contact support.'
            }
          </p>
          <div className="space-y-2">
            <Button 
              onClick={() => navigate('/marketplace')} 
              className="w-full"
            >
              {paymentStatus === 'success' ? 'Continue Shopping' : 'Try Again'}
            </Button>
            {paymentStatus === 'failed' && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/cart')} 
                className="w-full"
              >
                Back to Cart
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
