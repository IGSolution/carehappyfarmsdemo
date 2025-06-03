
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Minus } from 'lucide-react';
import { Product, CartItem } from '@/types/database';

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  user: any;
  profile: any;
  loading: boolean;
  onAddToCart: (productId: string) => void;
  onUpdateQuantity: (cartItemId: string, newQuantity: number) => void;
}

export function ProductCard({ 
  product, 
  cartItem, 
  user, 
  profile, 
  loading, 
  onAddToCart, 
  onUpdateQuantity 
}: ProductCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle className="text-lg">{product.name}</CardTitle>
        <CardDescription className="text-sm text-gray-600">
          {product.category}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {product.description && (
          <p className="text-sm text-gray-600 mb-3">{product.description}</p>
        )}
        <div className="flex justify-between items-center mb-4">
          <span className="text-2xl font-bold text-green-600">
            ₦{product.price}/{product.unit}
          </span>
          <span className="text-sm text-gray-500">
            Stock: {product.stock_quantity || 0}
          </span>
        </div>
        
        {user && profile?.role === 'customer' && cartItem ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                disabled={loading}
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="font-semibold">{cartItem.quantity}</span>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                disabled={loading}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            <span className="text-sm text-green-600">In Cart</span>
          </div>
        ) : user && profile?.role === 'farmer' ? (
          <Button disabled className="w-full" variant="outline">
            Farmers cannot purchase
          </Button>
        ) : (
          <Button
            onClick={() => onAddToCart(product.id)}
            disabled={loading || (product.stock_quantity || 0) <= 0}
            className="w-full"
          >
            {loading ? 'Adding...' : 
             (product.stock_quantity || 0) <= 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
