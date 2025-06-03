
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Leaf, Calendar, User, ArrowRight } from 'lucide-react';

const Blog = () => {
  const blogPosts = [
    {
      id: 1,
      title: "Sustainable Farming Practices in Nigeria: A Guide for Modern Farmers",
      excerpt: "Learn about eco-friendly farming techniques that can increase yields while protecting the environment.",
      author: "Dr. Adunni Okafor",
      date: "December 15, 2024",
      category: "Sustainability",
      readTime: "5 min read",
      image: "photo-1649972904349-6e44c42644a7"
    },
    {
      id: 2,
      title: "How Technology is Revolutionizing Agriculture in West Africa",
      excerpt: "Discover how digital platforms and smart farming tools are transforming agricultural practices across the region.",
      author: "Emmanuel Nkomo",
      date: "December 12, 2024",
      category: "Technology",
      readTime: "7 min read",
      image: "photo-1486312338219-ce68d2c6f44d"
    },
    {
      id: 3,
      title: "From Farm to Table: Building Direct Relationships with Consumers",
      excerpt: "Tips for farmers on how to market their products directly and build lasting customer relationships.",
      author: "Fatima Hassan",
      date: "December 10, 2024",
      category: "Marketing",
      readTime: "6 min read",
      image: "photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 4,
      title: "Seasonal Produce Guide: What to Grow and When in Nigeria",
      excerpt: "A comprehensive guide to Nigeria's agricultural seasons and the best crops for each period.",
      author: "Samuel Okoye",
      date: "December 8, 2024",
      category: "Farming Tips",
      readTime: "8 min read",
      image: "photo-1721322800607-8c38375eef04"
    }
  ];

  const categories = ["All", "Sustainability", "Technology", "Marketing", "Farming Tips", "Health"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <Link to="/" className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">Farm Store</h1>
            </Link>
            <div className="flex gap-2">
              <Link to="/marketplace">
                <Button variant="outline">Browse Marketplace</Button>
              </Link>
              <Link to="/auth">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Farm Store Blog
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Stay updated with the latest insights on sustainable farming, agricultural technology, 
            and market trends across Nigeria.
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
              className="mb-2"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Featured Post */}
        <div className="mb-16">
          <Card className="overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img
                  src={`https://images.unsplash.com/${blogPosts[0].image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`}
                  alt={blogPosts[0].title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Featured
                  </span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {blogPosts[0].category}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {blogPosts[0].title}
                </h3>
                <p className="text-gray-600 mb-4">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{blogPosts[0].author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{blogPosts[0].date}</span>
                  </div>
                  <span>{blogPosts[0].readTime}</span>
                </div>
                <Button className="group">
                  Read More
                  <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {blogPosts.slice(1).map((post) => (
            <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video">
                <img
                  src={`https://images.unsplash.com/${post.image}?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80`}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {post.category}
                  </span>
                </div>
                <CardTitle className="text-xl line-clamp-2">
                  {post.title}
                </CardTitle>
                <CardDescription className="line-clamp-3">
                  {post.excerpt}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    <span>{post.author}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{post.date}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">{post.readTime}</span>
                  <Button variant="ghost" size="sm" className="group">
                    Read More
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Stay Updated with Our Newsletter
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Get the latest insights on sustainable farming, market trends, and agricultural 
            innovations delivered straight to your inbox.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Button>Subscribe</Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2024 Farm Store. Connecting farmers and consumers across Nigeria.</p>
        </div>
      </footer>
    </div>
  );
};

export default Blog;
