
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product, CartItem, Profile } from '@/types/database';
import { User } from '@supabase/supabase-js';
import { Minus, Plus, Eye } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  cartItem?: CartItem;
  user: User | null;
  profile: Profile | null;
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
  const isOutOfStock = !product.is_available || (product.stock_quantity || 0) === 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="aspect-square bg-gray-100 rounded-md mb-3 flex items-center justify-center overflow-hidden">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-gray-400 text-4xl">📦</div>
          )}
        </div>
        <div className="space-y-2">
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
          <CardTitle className="text-lg leading-tight">{product.name}</CardTitle>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pt-0">
        <div className="space-y-2">
          <p className="text-2xl font-bold text-green-600">
            ₦{product.price}/{product.unit}
          </p>
          <p className="text-sm text-gray-500">
            Stock: {product.stock_quantity || 0} {product.unit}(s)
          </p>
          {isOutOfStock && (
            <Badge variant="destructive" className="text-xs">
              Out of Stock
            </Badge>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex flex-col gap-2">
        <Button asChild variant="outline" className="w-full" size="sm">
          <Link to={`/product/${product.id}`}>
            <Eye className="w-4 h-4 mr-2" />
            View Details
          </Link>
        </Button>
        
        {!isOutOfStock && (
          <>
            {cartItem ? (
              <div className="flex items-center justify-between w-full">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity - 1)}
                  disabled={loading}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="mx-3 font-medium">{cartItem.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onUpdateQuantity(cartItem.id, cartItem.quantity + 1)}
                  disabled={loading || cartItem.quantity >= (product.stock_quantity || 0)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <Button
                onClick={() => onAddToCart(product.id)}
                disabled={loading}
                className="w-full"
                size="sm"
              >
                Add to Cart
              </Button>
            )}
          </>
        )}
      </CardFooter>
    </Card>
  );
}
