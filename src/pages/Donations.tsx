
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, DollarSign } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export default function Donations() {
  // Donation form state
  const [donationAmount, setDonationAmount] = useState('');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donationMessage, setDonationMessage] = useState('');
  
  // Contact form state (separate from donation form)
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleDonationPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!donationAmount || !donorName || !donorEmail) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(donationAmount);
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessingPayment(true);
    try {
      // Initialize payment with Paystack
      const { data, error } = await supabase.functions.invoke('initialize-payment', {
        body: {
          email: donorEmail,
          amount: amount,
          currency: 'NGN',
          callback_url: `${window.location.origin}/payment-success`,
          metadata: {
            type: 'donation',
            donor_name: donorName,
            message: donationMessage || 'No message provided'
          }
        }
      });

      if (error) throw error;

      if (data?.data?.authorization_url) {
        // Redirect to Paystack payment page
        window.location.href = data.data.authorization_url;
      } else {
        throw new Error('Failed to get payment authorization URL');
      }
    } catch (error) {
      console.error('Error initializing payment:', error);
      toast({
        title: "Payment Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: {
          name: contactName,
          email: contactEmail,
          subject: "Investor Inquiry",
          message: contactMessage
        }
      });

      if (error) throw error;

      toast({
        title: "Message Sent!",
        description: "Your message has been sent successfully. We'll get back to you soon.",
      });

      // Reset contact form only
      setContactName('');
      setContactEmail('');
      setContactMessage('');
    } catch (error) {
      console.error('Error sending contact message:', error);
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Support Our Farm Store</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Join us in revolutionizing local agriculture. Your donation helps connect farmers with communities 
            and creates sustainable food systems for everyone.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Donation Form with Payment */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
              <CardTitle className="text-2xl">Make a Donation</CardTitle>
              <CardDescription>
                Support our mission with a secure payment through Paystack
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleDonationPayment} className="space-y-6">
                <div>
                  <Label htmlFor="donationAmount">Donation Amount (₦) *</Label>
                  <Input
                    id="donationAmount"
                    type="number"
                    min="1"
                    step="0.01"
                    placeholder="Enter amount in Naira"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="donorName">Full Name *</Label>
                  <Input
                    id="donorName"
                    type="text"
                    placeholder="Your full name"
                    value={donorName}
                    onChange={(e) => setDonorName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="donorEmail">Email Address *</Label>
                  <Input
                    id="donorEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={donorEmail}
                    onChange={(e) => setDonorEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="donationMessage">Message (Optional)</Label>
                  <Textarea
                    id="donationMessage"
                    placeholder="Tell us about your motivation to support us..."
                    value={donationMessage}
                    onChange={(e) => setDonationMessage(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-green-600 hover:bg-green-700"
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? "Processing Payment..." : "Donate Now"}
                </Button>
                
                <p className="text-sm text-gray-500 text-center">
                  Secure payment powered by Paystack
                </p>
              </form>
            </CardContent>
          </Card>

          {/* Contact Form */}
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Get in Touch</CardTitle>
              <CardDescription>
                Have questions about investment opportunities? We'd love to hear from you.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="contactName">Full Name *</Label>
                  <Input
                    id="contactName"
                    type="text"
                    placeholder="Your full name"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactEmail">Email Address *</Label>
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="your.email@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactMessage">Message *</Label>
                  <Textarea
                    id="contactMessage"
                    placeholder="Tell us about your investment interests, questions, or how you'd like to get involved..."
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    rows={6}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Impact Section */}
        <div className="mt-16 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Your Impact</h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-green-600 mb-3">Support Local Farmers</h3>
              <p className="text-gray-600">
                Your donation helps farmers access better markets and fair pricing for their produce.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Build Communities</h3>
              <p className="text-gray-600">
                Strengthen local food systems and create connections between producers and consumers.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-purple-600 mb-3">Sustainable Future</h3>
              <p className="text-gray-600">
                Invest in environmentally sustainable farming practices and food distribution.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="mt-16 bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Direct Contact</h2>
          <p className="text-gray-600 mb-6">
            For immediate assistance or large donation inquiries, contact us directly:
          </p>
          <div className="space-y-2">
            <p className="text-lg">
              <strong>Email:</strong> <a href="mailto:admin@primeorbs.com" className="text-blue-600 hover:underline">admin@primeorbs.com</a>
            </p>
            <p className="text-lg">
              <strong>Phone:</strong> <a href="tel:+1234567890" className="text-blue-600 hover:underline">+1 (234) 567-890</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
