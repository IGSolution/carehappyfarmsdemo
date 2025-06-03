
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Leaf } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface MobileNavProps {
  isAuthenticated?: boolean;
  onSignOut?: () => void;
}

export const MobileNav = ({ isAuthenticated, onSignOut }: MobileNavProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-green-500"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div className="absolute top-16 inset-x-0 p-2 transition transform origin-top-right z-50">
          <div className="rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 bg-white divide-y-2 divide-gray-50">
            <div className="pt-5 pb-6 px-5">
              <div className="flex items-center">
                <Link to="/" onClick={closeMenu}>
                  <div className="flex items-center">
                    <Leaf className="h-8 w-8 text-green-600" />
                    <span className="ml-2 text-xl font-bold text-gray-900">Farm Store</span>
                  </div>
                </Link>
              </div>
              <div className="mt-6">
                <nav className="grid gap-y-8">
                  <Link
                    to="/marketplace"
                    onClick={closeMenu}
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">
                      Marketplace
                    </span>
                  </Link>
                  <Link
                    to="/about"
                    onClick={closeMenu}
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">
                      About
                    </span>
                  </Link>
                  <Link
                    to="/blog"
                    onClick={closeMenu}
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">
                      Blog
                    </span>
                  </Link>
                  <Link
                    to="/contact"
                    onClick={closeMenu}
                    className="-m-3 p-3 flex items-center rounded-md hover:bg-gray-50"
                  >
                    <span className="ml-3 text-base font-medium text-gray-900">
                      Contact
                    </span>
                  </Link>
                </nav>
              </div>
            </div>
            <div className="py-6 px-5 space-y-6">
              {isAuthenticated ? (
                <div className="space-y-2">
                  <Link
                    to="/dashboard"
                    onClick={closeMenu}
                    className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      onSignOut?.();
                      closeMenu();
                    }}
                    className="w-full flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    to="/auth"
                    onClick={closeMenu}
                    className="w-full flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
