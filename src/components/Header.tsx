
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { MobileNav } from "@/components/MobileNav";
import logo from "../assets/android-chrome-192x192.png";

export default function Header () {
    return (
        <>
    {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <img
                src={logo}
                alt="logo"
                className="h-8 w-8 text-green-600 mr-2"
              />
              <h1 className="text-2xl font-bold text-gray-900">KRP Farm</h1>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/marketplace"
                className="text-gray-500 hover:text-gray-900"
              >
                Marketplace
              </Link>
              <Link
                to="/about"
                className="text-gray-500 hover:text-gray-900 font-medium"
              >
                About
              </Link>
              {/*<Link to="/blog" className="text-gray-500 hover:text-gray-900">
                Blog
              </Link>*/}
              <Link to="/contact" className="text-gray-500 hover:text-gray-900">
                Contact
              </Link>
              <Link to="/donations" className="text-gray-500 hover:text-gray-900">
                Donations
              </Link>
            </nav>

            <div className="hidden md:flex gap-2">
              <Link to="/marketplace">
                <Button variant="outline">Browse Marketplace</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>

            {/* Mobile Navigation */}
            <MobileNav />
          </div>
        </div>
      </header>
      </>
    )
}
