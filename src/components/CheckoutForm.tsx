
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { CartItem, LocationType } from '@/types/database';

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

interface CheckoutFormProps {
  cartItems: CartItem[];
  cartTotal: number;
  onCheckoutComplete: () => void;
}

export default function CheckoutForm({ cartItems, cartTotal, onCheckoutComplete }: CheckoutFormProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  
  // Delivery Information
  const [deliveryLocation, setDeliveryLocation] = useState<LocationType>('lagos');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [additionalDirections, setAdditionalDirections] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'paystack' | 'flutterwave'>('paystack');

  const handleCheckout = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to complete your order",
        variant: "destructive",
      });
      return;
    }

    if (!deliveryAddress.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a delivery address",
        variant: "destructive",
      });
      return;
    }

    if (!phoneNumber.trim()) {
      toast({
        title: "Missing information",
        description: "Please enter a phone number",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Empty cart",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Create order first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user?.id,
          total_amount: cartTotal,
          delivery_location: deliveryLocation,
          delivery_address: `${deliveryAddress}${additionalDirections ? '\n\nAdditional directions: ' + additionalDirections : ''}`,
          status: 'pending',
          phone_number: phoneNumber
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product_id,
        farmer_id: item.product?.farmer_id,
        quantity: item.quantity,
        unit_price: item.product?.price || 0
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) throw orderItemsError;

      // Initialize payment based on selected method
      const paymentFunction = paymentMethod === 'paystack' ? 'initialize-payment' : 'initialize-flutterwave-payment';
      
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke(paymentFunction, {
        body: {
          email: user?.email,
          amount: cartTotal,
          currency: "NGN",
          callback_url: window.location.origin + '/payment-success',
          metadata: {
            order_id: orderData.id,
            customer_id: user?.id,
            payment_method: paymentMethod
          }
        }
      });

      if (paymentError) throw paymentError;

      if (paymentData.status && paymentData.data?.authorization_url) {
        // Store order ID for verification later
        localStorage.setItem('pending_order_id', orderData.id);
        
        // Send notification to farmers
        await notifyFarmers(orderItems);
        
        // Redirect to payment page
        window.location.href = paymentData.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "Failed to process checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const notifyFarmers = async (orderItems: any[]) => {
    try {
      // Get unique farmer IDs
      const farmerIds = [...new Set(orderItems.map(item => item.farmer_id))];
      
      // Send notification email to each farmer
      for (const farmerId of farmerIds) {
        await supabase.functions.invoke('send-order-notification', {
          body: {
            farmer_id: farmerId,
            order_items: orderItems.filter(item => item.farmer_id === farmerId),
            customer_email: user?.email,
            delivery_address: deliveryAddress
          }
        });
      }
    } catch (error) {
      console.error('Failed to notify farmers:', error);
      // Don't block checkout if notification fails
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Delivery Information</h3>
        
        <div className="space-y-2">
          <Label htmlFor="location">Delivery Location</Label>
          <Select value={deliveryLocation} onValueChange={(value: LocationType) => setDeliveryLocation(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
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
          <Label htmlFor="address">Delivery Address *</Label>
          <Textarea
            id="address"
            placeholder="Enter your full delivery address (house number, street, area, landmark)"
            value={deliveryAddress}
            onChange={(e) => setDeliveryAddress(e.target.value)}
            required
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="directions">Additional Directions (Optional)</Label>
          <Textarea
            id="directions"
            placeholder="Any additional directions or special instructions for delivery"
            value={additionalDirections}
            onChange={(e) => setAdditionalDirections(e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="Enter your phone number for delivery updates"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Payment Method</h3>
        <RadioGroup value={paymentMethod} onValueChange={(value: 'paystack' | 'flutterwave') => setPaymentMethod(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="paystack" id="paystack" />
            <Label htmlFor="paystack">Paystack (Card, Bank Transfer, USSD)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="flutterwave" id="flutterwave" />
            <Label htmlFor="flutterwave">Flutterwave (Card, Bank Transfer, Mobile Money)</Label>
          </div>
        </RadioGroup>
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">Total:</span>
          <span className="text-2xl font-bold text-green-600">
            ₦{cartTotal.toFixed(2)}
          </span>
        </div>
        
        <Button
          onClick={handleCheckout}
          disabled={loading}
          className="w-full"
          size="lg"
        >
          {loading ? 'Processing...' : `Pay ₦${cartTotal.toFixed(2)} with ${paymentMethod === 'paystack' ? 'Paystack' : 'Flutterwave'}`}
        </Button>
      </div>
    </div>
  );
}
