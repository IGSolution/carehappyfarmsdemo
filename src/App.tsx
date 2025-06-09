
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Marketplace from "./pages/Marketplace";
import Cart from "./pages/Cart";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import Blog from "./pages/Blog";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import ConfirmEmail from "./pages/ConfirmEmail"
import MainLayout from "@/components/layouts/MainLayout"; // import the new layout
import Donations from "./pages/Donations";
import Signup from "./pages/Admin/Signup";
import Signin from "./pages/Admin/Signin";
import ProductDetail from "./pages/ProductDetail";
import InviteUser from "./pages/InviteUser";
const queryClient = new QueryClient();

function AppRoutes() {
  const { user, profile, loading } = useAuth();
  console.log('User:', user);
  console.log('Profile:', profile);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />
       <Route path="/admin-signup" element={<Signup/>} />
        <Route path="/admin-signin" element={<Signin/>} />
      <Route path="/confirm-email" element={<ConfirmEmail />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/invite" element={<InviteUser/>}/>

      {/* Public routes */}
      <Route element={<MainLayout />}>
       <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/donations" element={<Donations/>}/>

        {/* Redirect based on user status */}
        <Route path="/" element={

          user ? (
             profile?.role === 'admin' ?(
               <Navigate to="/dashboard" replace />
             ): user.email_confirmed_at ?(
               <Navigate to="/marketplace" replace />
             ):(
               <Navigate to="/auth" replace />
             )
            
          ) : (
            <Index />
          )
        } />


      </Route>

      <Route path="/marketplace" element={<Marketplace />} />

    <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/cart" element={<Cart />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;