
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Product, CartItem } from '@/types/database';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { ProductFilters } from '@/components/ProductFilters';
import { ProductCard } from '@/components/ProductCard';
import { CartSummary } from '@/components/CartSummary';

export default function Marketplace() {
  const { user, signOut, profile } = useAuth();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  const fetchProducts = async () => {
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_available', true)
      .order('created_at', { ascending: false });

    if (categoryFilter !== 'all') {
      query = query.eq('category', categoryFilter);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
  };

  const fetchCartItems = async () => {
    if (!user) return;
    
    const { data, error } = await supabase
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', user?.id);

    if (error) {
      console.error('Error fetching cart:', error);
    } else {
      setCartItems(data || []);
    }
  };

  const addToCart = async (productId: string) => {
    if (!user) {
      const guestCart = JSON.parse(localStorage.getItem('guest_cart') || '[]');
      const existingItem = guestCart.find((item: any) => item.product_id === productId);
      
      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        guestCart.push({ product_id: productId, quantity: 1 });
      }
      
      localStorage.setItem('guest_cart', JSON.stringify(guestCart));
      toast({
        title: "Added to cart",
        description: "Item added to cart. Sign in at checkout to complete your order.",
      });
      return;
    }

    setLoading(true);
    try {
      const existingItem = cartItems.find(item => item.product_id === productId);
      
      if (existingItem) {
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);
        
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user?.id,
            product_id: productId,
            quantity: 1
          });
        
        if (error) throw error;
      }

      toast({
        title: "Success",
        description: "Item added to cart",
      });
      
      fetchCartItems();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCartQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);
      
      if (!error) {
        fetchCartItems();
      }
    } else {
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity: newQuantity })
        .eq('id', cartItemId);
      
      if (!error) {
        fetchCartItems();
      }
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const cartTotal = cartItems.reduce((total, item) => 
    total + ((item.product?.price || 0) * item.quantity), 0
  );

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const guestCartCount = !user ? JSON.parse(localStorage.getItem('guest_cart') || '[]').reduce((total: number, item: any) => total + item.quantity, 0) : 0;

  useEffect(() => {
    fetchProducts();
  }, [categoryFilter]);

  return (
    <div className="min-h-screen bg-gray-50">
      <MarketplaceHeader 
        user={user}
        cartItemCount={cartItemCount}
        guestCartCount={guestCartCount}
        onSignOut={signOut}
      />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <ProductFilters
          searchTerm={searchTerm}
          categoryFilter={categoryFilter}
          onSearchChange={setSearchTerm}
          onCategoryChange={setCategoryFilter}
        />

        {filteredProducts.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-500">No products found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => {
              const cartItem = cartItems.find(item => item.product_id === product.id);
              
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  cartItem={cartItem}
                  user={user}
                  profile={profile}
                  loading={loading}
                  onAddToCart={addToCart}
                  onUpdateQuantity={updateCartQuantity}
                />
              );
            })}
          </div>
        )}

        <CartSummary
          user={user}
          profile={profile}
          cartTotal={cartTotal}
          cartItemCount={cartItemCount}
          guestCartCount={guestCartCount}
        />
      </main>
    </div>
  );
}
