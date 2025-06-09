import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Product } from '@/types/database';
import { ArrowLeft, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .eq('is_available', true)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Product not found",
          variant: "destructive",
        });
      } else {
        setProduct(data);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existingItem = guestCart.find((item: any) => item.product_id === id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        guestCart.push({ product_id: id, quantity });
      }
      
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      toast({
        title: "Added to cart",
        description: "Item added to cart. Sign in at checkout to complete your order.",
      });
      return;
    }

    setAddingToCart(true);
    try {
      // Check if item already exists in cart
      const { data: existingItems } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (existingItems && existingItems.length > 0) {
        // Update existing cart item
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItems[0].quantity + quantity })
          .eq('id', existingItems[0].id);
        
        if (error) throw error;
      } else {
        // Insert new cart item
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: id,
            quantity
          });
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: `${quantity} item(s) added to cart`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const increaseQuantity = () => {
    if (product && quantity < (product.stock_quantity || 0)) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card>
          <CardContent className="p-8 text-center">
            <p className="text-gray-500 mb-4">Product not found</p>
            <Button asChild>
              <Link to="/marketplace">Back to Marketplace</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Button asChild variant="outline" className="mb-6">
          <Link to="/marketplace">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Marketplace
          </Link>
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <div className="text-gray-400 text-6xl">📦</div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {product.category}
              </Badge>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-2xl font-bold text-green-600">
                ₦{product.price}/{product.unit}
              </p>
            </div>

            {product.description && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{product.description}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Specifications</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Unit:</span>
                    <p className="font-medium">{product.unit}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <p className="font-medium">{product.category}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Stock Available:</span>
                    <p className="font-medium">{product.stock_quantity || 0} {product.unit}(s)</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Status:</span>
                    <Badge variant={product.is_available ? "default" : "destructive"}>
                      {product.is_available ? "Available" : "Out of Stock"}
                    </Badge>
                  </div>
                </div>
              </div>

              {product.is_available && (product.stock_quantity || 0) > 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Quantity
                    </label>
                    <div className="flex items-center space-x-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={decreaseQuantity}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="px-4 py-2 border rounded-md text-center min-w-[60px]">
                        {quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={increaseQuantity}
                        disabled={quantity >= (product.stock_quantity || 0)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      Maximum available: {product.stock_quantity} {product.unit}(s)
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between text-lg">
                      <span>Total:</span>
                      <span className="font-bold text-green-600">
                        ₦{(product.price * quantity).toFixed(2)}
                      </span>
                    </div>
                    
                    <Button
                      onClick={addToCart}
                      disabled={addingToCart}
                      className="w-full"
                      size="lg"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {addingToCart ? 'Adding to Cart...' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              )}

              {(!product.is_available || (product.stock_quantity || 0) === 0) && (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">This product is currently out of stock</p>
                  <Button asChild variant="outline">
                    <Link to="/marketplace">Browse Other Products</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
