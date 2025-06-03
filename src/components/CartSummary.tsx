
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface CartSummaryProps {
  user: any;
  profile: any;
  cartTotal: number;
  cartItemCount: number;
  guestCartCount: number;
}

export function CartSummary({ user, profile, cartTotal, cartItemCount, guestCartCount }: CartSummaryProps) {
  const navigate = useNavigate();

  if (!((user && profile?.role === 'customer' && cartItemCount > 0) || (!user && guestCartCount > 0))) {
    return null;
  }

  return (
    <Card className="mt-8 sticky bottom-4">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div>
            {user ? (
              <>
                <span className="font-semibold">Cart Total: ₦{cartTotal.toFixed(2)}</span>
                <span className="text-sm text-gray-600 ml-2">({cartItemCount} items)</span>
              </>
            ) : (
              <>
                <span className="font-semibold">Items in Cart: {guestCartCount}</span>
                <span className="text-sm text-gray-600 ml-2">(Sign in at checkout)</span>
              </>
            )}
          </div>
          <Button onClick={() => navigate('/cart')}>
            View Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
