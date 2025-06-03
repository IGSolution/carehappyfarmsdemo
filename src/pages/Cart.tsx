
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { CartItem, LocationType } from '@/types/database';
import { Minus, Plus, Trash2, ArrowLeft } from 'lucide-react';

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

export default function Cart() {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [deliveryLocation, setDeliveryLocation] = useState<LocationType>('lagos');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user?.id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch cart items",
        variant: "destructive",
      });
    } else {
      setCartItems(data || []);
    }
  };

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    const { error } = await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', cartItemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update quantity",
        variant: "destructive",
      });
    } else {
      fetchCartItems();
    }
  };

  const removeItem = async (cartItemId: string) => {
    const { error } = await supabase
      .from('cart_items')
      .delete()
      .eq('id', cartItemId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    } else {
      fetchCartItems();
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    }
  };

  const handleCheckout = async () => {
    if (!deliveryAddress.trim()) {
      toast({
        title: "Error",
        description: "Please enter a delivery address",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const totalAmount = cartItems.reduce((total, item) => 
        total + ((item.product?.price || 0) * item.quantity), 0
      );

      // Create order first
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: user?.id,
          total_amount: totalAmount,
          delivery_location: deliveryLocation,
          delivery_address: deliveryAddress,
          status: 'pending'
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

      // Initialize payment with Paystack
      const { data: paymentData, error: paymentError } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: user?.email,
          amount: totalAmount,
          currency: "NGN",
          callback_url: window.location.origin + '/payment-success',
          metadata: {
            order_id: orderData.id,
            customer_id: user?.id
          }
        }
      });

      if (paymentError) throw paymentError;

      if (paymentData.status && paymentData.data?.authorization_url) {
        // Store order ID for verification later
        localStorage.setItem('pending_order_id', orderData.id);
        
        // Redirect to Paystack payment page
        window.location.href = paymentData.data.authorization_url;
      } else {
        throw new Error('Failed to initialize payment');
      }

    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process checkout",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const cartTotal = cartItems.reduce((total, item) => 
    total + ((item.product?.price || 0) * item.quantity), 0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/marketplace')} className="mr-4">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Marketplace
              </Button>
              <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        {cartItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500 mb-4">Your cart is empty</p>
              <Button onClick={() => navigate('/marketplace')}>
                Continue Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Cart Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h3 className="font-semibold">{item.product?.name}</h3>
                        <p className="text-sm text-gray-600">{item.product?.category}</p>
                        <p className="text-lg font-bold text-green-600">
                          ₦{item.product?.price}/{item.product?.unit}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="font-semibold min-w-[2rem] text-center">
                            {item.quantity}
                          </span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>
                        
                        <div className="text-right">
                          <p className="font-bold">
                            ₦{((item.product?.price || 0) * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removeItem(item.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Checkout */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Checkout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
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
                    <Label htmlFor="address">Delivery Address</Label>
                    <Input
                      id="address"
                      placeholder="Enter your full address"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      required
                    />
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
                      {loading ? 'Processing...' : 'Place Order'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
