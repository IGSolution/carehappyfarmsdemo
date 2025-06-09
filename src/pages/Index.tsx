
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Leaf, Users, ShoppingCart, TrendingUp, Star, ChevronRight } from 'lucide-react';
import FAQ from '@/components/FAQ';


const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-green-600">Your Healthy Fresh Alternative
                <br /> On The Go</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              WE DELIVER THE BEST PRODUCTS.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/marketplace">
                  <Button size="lg" className="w-full">
                    Start Shopping
                  </Button>
                </Link>
              </div>
              <div className="mt-3 sm:mt-0 sm:ml-3">
                <Link to="/donations">
                  <Button variant="outline" size="lg" className="w-full">
                    Support Our Mission
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">
              Why Choose KRP Farm?
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              KRP Farms since 2011 has been delivering fruits, veggies & more across Nigeria
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Fresh & Local</h3>
                <p className="mt-2 text-base text-gray-500">
                  Direct from farms to ensure maximum freshness and quality
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Support Farmers</h3>
                <p className="mt-2 text-base text-gray-500">
                  Help local farmers get fair prices for their hard work
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <ShoppingCart className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Easy Shopping</h3>
                <p className="mt-2 text-base text-gray-500">
                  Simple ordering process with delivery to your location
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Fair Prices</h3>
                <p className="mt-2 text-base text-gray-500">
                  Affordable prices, with no middleman involved
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">How It Works</h2>
            <p className="mt-4 text-lg text-gray-500">
              Getting fresh produce has never been easier
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <CardTitle className="text-center">Browse & Select</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Browse fresh produce from verified local farmers in your area
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <CardTitle className="text-center">Place Order</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Add items to cart and place your order with secure payment
                  </CardDescription>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                    <span className="text-lg font-bold">3</span>
                  </div>
                  <CardTitle className="text-center">Get Delivered</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">
                    Fresh produce delivered directly to your doorstep
                  </CardDescription>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">What Our Users Say</h2>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "I like the potatoes, received them in good conditions."
                </p>
                <div className="font-medium text-gray-900">- Abibi</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  KRP Farms is still my No.1 pick to supply my store with the best fresh fruits. I love the conditions."
                </p>
                <div className="font-medium text-gray-900">- Glena</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">
                  "My customers love the fruits and vegitables I got from you, thank you KRP Farms."
                </p>
                <div className="font-medium text-gray-900">- Sanisu</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <FAQ />


      {/* CTA Section */}
      <section className="bg-green-600 mb-16">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-green-200">Join thousands of satisfied customers.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/auth">
                <Button size="lg" variant="secondary" className="inline-flex items-center">
                  Get started
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>


    </div>
  );
};

export default Index;
