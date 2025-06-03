
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import logo from "../assets/android-chrome-192x192.png";

interface MarketplaceHeaderProps {
  user: any;
  cartItemCount: number;
  guestCartCount: number;
  onSignOut: () => void;
}

export function MarketplaceHeader({ user, cartItemCount, guestCartCount, onSignOut }: MarketplaceHeaderProps) {
  const navigate = useNavigate();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
           <Link to="/" className="flex items-center">
                        <img
                          src={logo}
                          alt="logo"
                          className="h-8 w-8 text-green-600 mr-2"
                        />
                        <h1 className="text-2xl font-bold text-gray-900">KRP Farm Market</h1>
                      </Link>
          <div className="flex items-center gap-4">
            <Button onClick={() => navigate('/cart')} variant="outline" className="relative">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart
              {((user && cartItemCount > 0) || (!user && guestCartCount > 0)) && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {user ? cartItemCount : guestCartCount}
                </span>
              )}
            </Button>
            
            {user ? (
              <Button onClick={onSignOut} variant="outline">
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
